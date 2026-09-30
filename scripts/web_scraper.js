/**
 * Next.js Live Web Scraper
 * Crawls and extracts documentation directly from https://nextjs.org/docs via HTTP
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LIVE_SCRAPED_DIR = path.join(ROOT_DIR, 'docs_web_scraped');
const BASE_URL = 'https://nextjs.org';
const START_URL = 'https://nextjs.org/docs';

// Simple HTML to Markdown extractor for Next.js docs articles
function htmlToMarkdown(html, pageUrl) {
  let title = 'Next.js Docs';
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].replace(/\s*\|\s*Next\.js$/, '').trim();
  }

  // Extract meta description
  let description = '';
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  // Find main content block
  let mainContent = '';
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  if (articleMatch) {
    mainContent = articleMatch[1];
  } else if (mainMatch) {
    mainContent = mainMatch[1];
  } else {
    mainContent = html;
  }

  // Remove scripts, styles, svg
  let text = mainContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '');

  // Convert headings
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n');
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n');

  // Convert code blocks
  text = text.replace(/<pre[^>]*><code(?:\s+class=["']language-([^"']+)["'])?[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => {
    const unescaped = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'");
    return `\n\n\`\`\`${lang || ''}\n${unescaped.trim()}\n\`\`\`\n\n`;
  });

  // Convert inline code
  text = text.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Convert links
  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, label) => {
    const cleanLabel = label.replace(/<[^>]+>/g, '').trim();
    if (!cleanLabel) return '';
    const fullHref = href.startsWith('/') ? `${BASE_URL}${href}` : href;
    return `[${cleanLabel}](${fullHref})`;
  });

  // Convert paragraphs and list items
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1');
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n');
  text = text.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n\n> $1\n\n');

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Clean excessive blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  // Assemble document
  let doc = `# ${title}\n\n`;
  doc += `> **Página web oficial:** [${pageUrl}](${pageUrl})  \n`;
  doc += `> **Versión extraída:** Next.js 16.3.7  \n`;
  if (description) {
    doc += `> **Descripción:** *${description}*  \n`;
  }
  doc += `\n---\n\n`;
  doc += text;

  return doc;
}

export async function runWebScraper(maxPages = 20) {
  console.log('====================================================');
  console.log(`🌐 Scraper Web Directo para ${START_URL}`);
  console.log(`📑 Límite configurado para prueba web: ${maxPages} páginas`);
  console.log('====================================================');

  await fs.mkdir(LIVE_SCRAPED_DIR, { recursive: true });

  const visited = new Set();
  const queue = [START_URL];

  console.log(`[1/2] Rastreando enlaces en ${START_URL}...`);
  try {
    const res = await fetch(START_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const docLinks = [...html.matchAll(/href=["'](\/docs\/[^"']+)["']/g)]
      .map(m => `${BASE_URL}${m[1].split('#')[0]}`)
      .filter(u => !u.endsWith('.svg') && !u.endsWith('.png') && !u.endsWith('.ico'));

    for (const link of docLinks) {
      if (!visited.has(link) && !queue.includes(link)) {
        queue.push(link);
      }
    }
    console.log(`  ✓ Encontrados ${queue.length} enlaces de documentación.`);
  } catch (err) {
    console.error(`Error inicial conectando a ${START_URL}:`, err.message);
    return;
  }

  console.log(`\n[2/2] Descargando y convirtiendo primeras ${Math.min(maxPages, queue.length)} páginas a Markdown...`);
  let count = 0;
  while (queue.length > 0 && count < maxPages) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    try {
      const res = await fetch(currentUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) continue;

      const html = await res.text();
      const markdown = htmlToMarkdown(html, currentUrl);

      // Create safe filename from URL
      let urlPath = currentUrl.replace(`${BASE_URL}/docs`, '').replace(/^\//, '');
      if (!urlPath) urlPath = 'index';
      urlPath = urlPath.replace(/\//g, '_') + '.md';

      const filePath = path.join(LIVE_SCRAPED_DIR, urlPath);
      await fs.writeFile(filePath, markdown, 'utf-8');
      count++;
      console.log(`  [${count}/${maxPages}] Guardado: ${urlPath}`);
    } catch (err) {
      console.warn(`  ! Fallo al scrapear ${currentUrl}: ${err.message}`);
    }
  }

  console.log('\n====================================================');
  console.log(`✅ Web scraping finalizado. ${count} páginas guardadas en '${LIVE_SCRAPED_DIR}'`);
  console.log('====================================================\n');
}

// Execute if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const limitArg = parseInt(process.argv[2] || '10', 10);
  runWebScraper(limitArg).catch(err => {
    console.error('Error en web scraper:', err);
    process.exit(1);
  });
}
