/**
 * Next.js Docs MDX to Clean Markdown Converter
 * Converts all 456 raw MDX docs into standardized, clean GitHub Flavored Markdown (.md)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_RAW_DIR = path.join(ROOT_DIR, 'docs_raw');
const DOCS_MD_DIR = path.join(ROOT_DIR, 'docs_markdown');

// Convert doc path to canonical nextjs.org live documentation URL
function docPathToLiveUrl(relPath) {
  let clean = relPath.replace(/\.mdx?$/, '');
  const segments = clean.split(/[/\\]/).map(seg => seg.replace(/^\d+-/, ''));
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return `https://nextjs.org/docs/${segments.join('/')}`;
}

// Map folder prefix to human-readable section breadcrumb
function getBreadcrumbs(relPath) {
  const parts = relPath.split(/[/\\]/);
  const titles = [];
  for (let i = 0; i < parts.length - 1; i++) {
    let seg = parts[i].replace(/^\d+-/, '');
    seg = seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    titles.push(seg);
  }
  return titles.join(' > ') || 'General';
}

// Parse YAML frontmatter simply without external dependency
function parseFrontmatter(rawText) {
  const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fmMatch) {
    return { frontmatter: {}, body: rawText };
  }
  const fmBlock = fmMatch[1];
  const body = rawText.slice(fmMatch[0].length);
  
  const frontmatter = {};
  const lines = fmBlock.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    const keyVal = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (keyVal) {
      currentKey = keyVal[1];
      let val = keyVal[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      frontmatter[currentKey] = val;
    } else if (currentKey && line.startsWith('  ')) {
      frontmatter[currentKey] += ' ' + line.trim();
    }
  }

  return { frontmatter, body };
}

// Clean and convert MDX body to standard Markdown
function cleanMdxContent(body, isAppRouter, isPagesRouter) {
  let text = body;

  // 1. Remove MDX comments: {/* ... */}
  text = text.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

  // 2. Handle <AppOnly> and <PagesOnly> tags
  if (isAppRouter) {
    // In App Router files, unwrap AppOnly
    text = text.replace(/<\/?AppOnly>/g, '');
    // Wrap PagesOnly content in a formatted note blockquote
    text = text.replace(/<PagesOnly>([\s\S]*?)<\/PagesOnly>/g, (_, inner) => {
      const trimmed = inner.trim();
      if (!trimmed) return '';
      const quoted = trimmed.split('\n').map(l => `> ${l}`).join('\n');
      return `\n\n> 📘 **Nota para Pages Router:**\n${quoted}\n\n`;
    });
  } else if (isPagesRouter) {
    // In Pages Router files, unwrap PagesOnly
    text = text.replace(/<\/?PagesOnly>/g, '');
    // Wrap AppOnly content in a formatted note blockquote
    text = text.replace(/<AppOnly>([\s\S]*?)<\/AppOnly>/g, (_, inner) => {
      const trimmed = inner.trim();
      if (!trimmed) return '';
      const quoted = trimmed.split('\n').map(l => `> ${l}`).join('\n');
      return `\n\n> 📗 **Nota para App Router:**\n${quoted}\n\n`;
    });
  } else {
    // Shared or Architecture docs
    text = text.replace(/<\/?AppOnly>/g, '');
    text = text.replace(/<\/?PagesOnly>/g, '');
  }

  // 3. Convert <Check /> and <Cross /> to icons
  text = text.replace(/<Check\s*\/?>/g, '✅');
  text = text.replace(/<Cross\s*\/?>/g, '❌');

  // 4. Convert <Image ... /> tags to standard markdown images: ![alt](src)
  text = text.replace(/<Image\s+([^>]*?)\/?>/g, (match, attrs) => {
    const altMatch = attrs.match(/alt=["']([^"']*)["']/);
    const srcMatch = attrs.match(/src=["']([^"']*)["']/);
    const alt = altMatch ? altMatch[1] : 'Illustration';
    let src = srcMatch ? srcMatch[1] : '';
    if (src.startsWith('/')) {
      src = `https://nextjs.org${src}`;
    }
    return `\n\n![${alt}](${src})\n\n`;
  });

  // 5. Convert <Link href="...">Text</Link> to [Text](href)
  text = text.replace(/<Link\s+href=["']([^"']+)["']>([\s\S]*?)<\/Link>/g, '[$2]($1)');

  // 6. Unwrap FixCard / FixCardGrid
  text = text.replace(/<\/?FixCardGrid>/g, '');
  text = text.replace(/<FixCard\s+([^>]*?)>([\s\S]*?)<\/FixCard>/g, (_, attrs, inner) => {
    return `\n- ${inner.trim()}\n`;
  });

  // 7. Clean code block fences with metadata (e.g., ```bash package="pnpm")
  text = text.replace(/^```([a-zA-Z0-9_-]+)\s+package=["']([^"']+)["']/gm, (_, lang, pkg) => {
    return `\`\`\`${lang}\n# Manejador de paquetes: ${pkg}`;
  });
  text = text.replace(/^```([a-zA-Z0-9_-]+)\s+filename=["']([^"']+)["']/gm, (_, lang, fn) => {
    return `\`\`\`${lang}\n// Archivo: ${fn}`;
  });

  // 8. Clean trailing double spaces / excessive blank lines
  text = text.replace(/\n{4,}/g, '\n\n');

  return text.trim();
}

async function getAllFiles(dir, fileList = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await getAllFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export async function processAllMarkdown() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('🧹 Limpieza y Estandarización de Documentación MDX -> MD');
  console.log('====================================================');

  await fs.mkdir(DOCS_MD_DIR, { recursive: true });
  const rawFiles = await getAllFiles(DOCS_RAW_DIR);
  console.log(`[1/2] Procesando ${rawFiles.length} archivos fuente...`);

  let count = 0;
  for (const rawFilePath of rawFiles) {
    const relPath = path.relative(DOCS_RAW_DIR, rawFilePath);
    const isApp = relPath.startsWith('01-app');
    const isPages = relPath.startsWith('02-pages');

    const rawContent = await fs.readFile(rawFilePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(rawContent);

    // Cleaned body
    const cleanedBody = cleanMdxContent(body, isApp, isPages);

    // Build canonical metadata header
    const liveUrl = docPathToLiveUrl(relPath);
    const breadcrumb = getBreadcrumbs(relPath);
    const title = frontmatter.title || path.basename(relPath, path.extname(relPath));
    const description = frontmatter.description || '';

    let headerMd = `# ${title}\n\n`;
    headerMd += `> **Documentación Oficial Next.js v16.3.7**  \n`;
    headerMd += `> 🌐 **URL en vivo:** [${liveUrl}](${liveUrl})  \n`;
    headerMd += `> 📂 **Sección:** ${breadcrumb}  \n`;
    if (description) {
      headerMd += `> 📝 **Descripción:** *${description}*  \n`;
    }
    headerMd += `\n---\n\n`;

    const finalMarkdown = headerMd + cleanedBody + '\n';

    // Target destination file (replace .mdx with .md)
    const targetRelPath = relPath.replace(/\.mdx$/, '.md');
    const targetFilePath = path.join(DOCS_MD_DIR, targetRelPath);
    await fs.mkdir(path.dirname(targetFilePath), { recursive: true });
    await fs.writeFile(targetFilePath, finalMarkdown, 'utf-8');

    count++;
    if (count % 50 === 0 || count === rawFiles.length) {
      process.stdout.write(`\r  Transformados: ${count}/${rawFiles.length} (${Math.round((count / rawFiles.length) * 100)}%)`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n\n[2/2] Proceso de limpieza finalizado:');
  console.log(`  • Archivos generados en Markdown estándar: ${count}`);
  console.log(`  • Directorio de salida: ${DOCS_MD_DIR}`);
  console.log(`  • Tiempo total: ${elapsed} segundos`);
  console.log('====================================================\n');
}

// Execute if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  processAllMarkdown().catch(err => {
    console.error('Error fatal al limpiar Markdown:', err);
    process.exit(1);
  });
}
