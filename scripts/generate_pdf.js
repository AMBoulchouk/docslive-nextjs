/**
 * Next.js v16.3.7 PDF Book Generator
 * Converts the compiled book into a high-quality, beautifully formatted PDF
 * using Chromium headless rendering with full print CSS.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BOOK_MD_PATH = path.join(ROOT_DIR, 'book', 'Nextjs_16_Guia_Definitiva.md');
const HTML_OUTPUT_PATH = path.join(ROOT_DIR, 'book', 'book_printable.html');
const PDF_OUTPUT_PATH = path.join(ROOT_DIR, 'Nextjs_16_Guia_Definitiva.pdf');
const COVER_TEMPLATE_PATH = path.join(ROOT_DIR, 'templates', 'cover.html');

// Locate Chrome or Edge executable on Windows
async function getBrowserExecutable() {
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // Continue searching
    }
  }
  throw new Error('No se encontró Google Chrome ni Microsoft Edge en las rutas estándar.');
}

function generateHtmlTemplate(contentHtml, coverHtml = '') {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const parsedCover = coverHtml.replace(/\{\{DATE\}\}/g, currentDate);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Next.js v16.3.7 — Libro Guía Definitivo</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 14mm 20mm 14mm;
      @bottom-right {
        content: counter(page);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 8pt;
        color: #71717a;
      }
      @bottom-left {
        content: "Next.js v16.3.7 — Libro Guía Definitivo";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 8pt;
        color: #a1a1aa;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.55;
      color: #18181b;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Cover Page */
    .cover-page {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      padding: 40px 20px;
      background: linear-gradient(145deg, #09090b 0%, #18181b 100%);
      color: #ffffff;
      border-radius: 8px;
    }

    .cover-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .cover-logo {
      width: 50px;
      height: 50px;
      fill: #ffffff;
    }

    .cover-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #38bdf8;
      font-size: 10pt;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }

    .cover-body {
      margin-top: auto;
      margin-bottom: auto;
    }

    .cover-title {
      font-size: 38pt;
      font-weight: 800;
      line-height: 1.1;
      margin: 0 0 16px 0;
      letter-spacing: -1.5px;
      background: linear-gradient(180deg, #ffffff 0%, #a1a1aa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 16pt;
      font-weight: 400;
      color: #cbd5e1;
      margin: 0 0 24px 0;
      line-height: 1.4;
      max-width: 600px;
    }

    .cover-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }

    .cover-pill {
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #f4f4f5;
      font-size: 9pt;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 500;
    }

    .cover-footer {
      border-top: 1px solid #27272a;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 9pt;
      color: #a1a1aa;
    }

    /* Document Structure & Breaks */
    h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #09090b;
      margin-top: 32px;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
      page-break-after: avoid;
    }

    /* Force page break on major chapters */
    h1[id^="capítulo"],
    h1:has(+ p > em),
    .chapter-header {
      page-break-before: always;
      border-bottom: 2px solid #0070f3;
      padding-bottom: 8px;
      margin-top: 0;
    }

    h2 {
      font-size: 14pt;
      font-weight: 600;
      color: #18181b;
      margin-top: 26px;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
      page-break-after: avoid;
      border-bottom: 1px solid #e4e4e7;
      padding-bottom: 4px;
    }

    h3 {
      font-size: 11.5pt;
      font-weight: 600;
      color: #27272a;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 10.5pt;
      font-weight: 600;
      color: #3f3f46;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 10px 0;
    }

    a {
      color: #0070f3;
      text-decoration: none;
    }

    /* Code Blocks */
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 6px;
      font-family: "Cascadia Code", "Fira Code", Consolas, Monaco, monospace;
      font-size: 8pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 12px 0;
      border: 1px solid #1e293b;
      page-break-inside: avoid;
      white-space: pre-wrap;
      word-break: break-word;
    }

    code {
      font-family: "Cascadia Code", "Fira Code", Consolas, Monaco, monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
      font-size: 8pt;
    }

    /* Details & Summary */
    details, details[open], details:not([open]) {
      display: block !important;
      margin: 10px 0;
    }
    details > * {
      display: block !important;
    }
    summary {
      font-weight: 600;
      color: #0f172a;
      cursor: pointer;
      margin-bottom: 6px;
    }

    /* Blockquotes & Notes */
    blockquote {
      margin: 12px 0;
      padding: 8px 14px;
      border-left: 3.5px solid #0070f3;
      background-color: #f8fafc;
      color: #334155;
      font-size: 9.5pt;
      border-radius: 0 4px 4px 0;
      page-break-inside: avoid;
    }

    blockquote p {
      margin: 0 0 6px 0;
    }

    blockquote p:last-child {
      margin-bottom: 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }

    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #0f172a;
    }

    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    /* Lists */
    ul, ol {
      margin: 6px 0 12px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 4px;
    }

    /* Separators */
    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  ${parsedCover}

  <!-- BOOK CONTENT -->
  <div class="book-content">
    ${contentHtml}
  </div>

</body>
</html>`;
}

export async function generatePdf() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('🖨️ Generando PDF del Libro: Nextjs_16_Guia_Definitiva.pdf');
  console.log('====================================================');

  // 1. Check markdown file existence
  try {
    await fs.access(BOOK_MD_PATH);
  } catch {
    throw new Error(`No se encontró el archivo del libro en ${BOOK_MD_PATH}. Ejecute primero 'npm run build:book'.`);
  }

  // 2. Read markdown and convert to HTML
  console.log('[1/4] Leyendo Markdown unificado y renderizando HTML con marked...');
  const mdContent = await fs.readFile(BOOK_MD_PATH, 'utf-8');
  
  // Custom marked options
  const htmlBody = marked.parse(mdContent);

  // 3. Read cover template
  let coverHtml = '';
  try {
    coverHtml = await fs.readFile(COVER_TEMPLATE_PATH, 'utf-8');
  } catch {
    console.warn('  ! Aviso: no se encontró templates/cover.html, usando portada por defecto.');
  }

  // 4. Generate complete styled HTML document
  console.log('[2/4] Inyectando hoja de estilos para impresión editorial y portada...');
  const fullHtml = generateHtmlTemplate(htmlBody, coverHtml);
  await fs.writeFile(HTML_OUTPUT_PATH, fullHtml, 'utf-8');
  console.log(`  ✓ HTML intermedio generado (${(fullHtml.length / 1024 / 1024).toFixed(2)} MB): ${HTML_OUTPUT_PATH}`);

  // 4. Locate browser engine
  const browserExe = await getBrowserExecutable();
  console.log(`[3/4] Motor de renderizado detectado: ${browserExe}`);

  // 5. Run headless Chromium print-to-pdf
  console.log('[4/4] Renderizando PDF con Chromium headless (esto puede tardar unos segundos)...');
  const fileUrl = `file:///${HTML_OUTPUT_PATH.replace(/\\/g, '/')}`;
  
  // Construct cmd command line
  const cmd = `cmd.exe /c "\"${browserExe}\" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=\"${PDF_OUTPUT_PATH}\" \"${fileUrl}\""`;
  
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      maxBuffer: 1024 * 1024 * 50,
      timeout: 180000 // 3 minutes timeout for massive document
    });
    if (stderr && !stderr.includes('written to file')) {
      // Chrome writes info to stderr on Windows
    }
  } catch (err) {
    // Try fallback with classic headless flag
    console.warn('  ! Reintentando con bandera --headless clásica...');
    const fallbackCmd = `cmd.exe /c "\"${browserExe}\" --headless --disable-gpu --print-to-pdf=\"${PDF_OUTPUT_PATH}\" \"${fileUrl}\""`;
    await execAsync(fallbackCmd, {
      maxBuffer: 1024 * 1024 * 50,
      timeout: 180000
    });
  }

  // 6. Verify result
  const pdfStats = await fs.stat(PDF_OUTPUT_PATH);
  const pdfSizeMb = (pdfStats.size / 1024 / 1024).toFixed(2);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n====================================================');
  console.log('🎉 ¡PDF GENERADO CON ÉXITO EN LA RAÍZ DEL PROYECTO!');
  console.log(`  • Ubicación: ${PDF_OUTPUT_PATH}`);
  console.log(`  • Tamaño del PDF: ${pdfSizeMb} MB`);
  console.log(`  • Tiempo total: ${elapsed} segundos`);
  console.log('====================================================\n');
}

// Execute if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  generatePdf().catch(err => {
    console.error('Error fatal al generar PDF:', err);
    process.exit(1);
  });
}
