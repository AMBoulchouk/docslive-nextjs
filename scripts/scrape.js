/**
 * Next.js v16.3.7 Documentation Scraper & Extractor
 * Fetches all official documentation files for v16.3.7 directly from source.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_RAW_DIR = path.join(ROOT_DIR, 'docs_raw');
const MANIFEST_PATH = path.join(ROOT_DIR, 'manifest_v16.3.7.json');

const TAG = 'v16.3.7';
const REPO = 'vercel/next.js';
const TREE_API = `https://api.github.com/repos/${REPO}/git/trees/${TAG}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${TAG}/`;

// Convert doc path to canonical nextjs.org live documentation URL
export function docPathToLiveUrl(docPath) {
  // e.g. docs/01-app/01-getting-started/01-installation.mdx -> https://nextjs.org/docs/app/getting-started/installation
  let clean = docPath.replace(/^docs\//, '');
  clean = clean.replace(/\.mdx?$/, '');
  
  // Remove leading numbers from path segments (01-app -> app, 01-getting-started -> getting-started)
  const segments = clean.split('/').map(seg => seg.replace(/^\d+-/, ''));
  
  if (segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  
  return `https://nextjs.org/docs/${segments.join('/')}`;
}

async function getDocManifest() {
  console.log(`[1/3] Obteniendo lista de archivos de documentación para Next.js ${TAG}...`);
  
  // First attempt: fetch live from GitHub Tree API
  try {
    const res = await fetch(TREE_API, {
      headers: { 'User-Agent': 'DocsLive-Scraper/1.0' }
    });
    
    if (res.ok) {
      const data = await res.json();
      const files = data.tree.filter(item => 
        item.path.startsWith('docs/') && 
        (item.path.endsWith('.md') || item.path.endsWith('.mdx'))
      );
      console.log(`  ✓ Árbol obtenido de GitHub API: ${files.length} archivos de documentación encontrados.`);
      await fs.writeFile(MANIFEST_PATH, JSON.stringify(files, null, 2), 'utf-8');
      return files;
    }
  } catch (err) {
    console.warn(`  ! Aviso al consultar GitHub API: ${err.message}`);
  }

  // Fallback: Read local manifest if available
  try {
    const localData = await fs.readFile(MANIFEST_PATH, 'utf-8');
    const files = JSON.parse(localData);
    console.log(`  ✓ Usando manifiesto local en caché: ${files.length} archivos.`);
    return files;
  } catch {
    throw new Error('No se pudo obtener el árbol de GitHub ni existe un manifiesto local.');
  }
}

async function downloadFile(docPath, retries = 3) {
  const url = `${RAW_BASE}${docPath}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}

async function runScraper() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log(`🚀 Iniciando extracción de Documentación Next.js ${TAG}`);
  console.log(`🌐 Base URL Oficial: https://nextjs.org/docs`);
  console.log('====================================================');

  await fs.mkdir(DOCS_RAW_DIR, { recursive: true });
  const files = await getDocManifest();

  console.log(`\n[2/3] Descargando ${files.length} archivos fuente en 'docs_raw/'...`);
  
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;
  const CONCURRENCY = 15;

  const queue = [...files];
  const workers = Array.from({ length: CONCURRENCY }, async (_, workerId) => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      
      const docPath = item.path;
      const targetFilePath = path.join(DOCS_RAW_DIR, docPath.replace(/^docs\//, ''));
      const targetDir = path.dirname(targetFilePath);

      try {
        await fs.mkdir(targetDir, { recursive: true });
        
        // Check if already downloaded
        let exists = false;
        try {
          await fs.access(targetFilePath);
          exists = true;
        } catch {
          exists = false;
        }

        if (exists) {
          skippedCount++;
        } else {
          const content = await downloadFile(docPath);
          await fs.writeFile(targetFilePath, content, 'utf-8');
          downloadedCount++;
        }

        const totalProcessed = downloadedCount + skippedCount + failedCount;
        if (totalProcessed % 25 === 0 || totalProcessed === files.length) {
          process.stdout.write(`\r  Progreso: ${totalProcessed}/${files.length} (${Math.round((totalProcessed / files.length) * 100)}%) - Descargados: ${downloadedCount}, Omitidos: ${skippedCount}`);
        }
      } catch (err) {
        failedCount++;
        console.error(`\n  ✖ Error descargando ${docPath}: ${err.message}`);
      }
    }
  });

  await Promise.all(workers);
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n\n[3/3] Descarga finalizada con éxito:');
  console.log(`  • Total de archivos: ${files.length}`);
  console.log(`  • Nuevos descargados: ${downloadedCount}`);
  console.log(`  • En caché / omitidos: ${skippedCount}`);
  console.log(`  • Fallidos: ${failedCount}`);
  console.log(`  • Directorio de destino: ${DOCS_RAW_DIR}`);
  console.log(`  • Tiempo total: ${elapsed} segundos`);
  console.log('====================================================\n');
}

// Execute if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  runScraper().catch(err => {
    console.error('Error fatal en el scraper:', err);
    process.exit(1);
  });
}
