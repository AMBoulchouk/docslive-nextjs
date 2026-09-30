/**
 * Next.js v16.3.7 Book Guide Builder
 * Assembles all 456 clean markdown sections into an organized Book Guide ("Libro Guía Next.js 16")
 * with Master Table of Contents, thematic chapters, and a complete unified volume.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCS_MD_DIR = path.join(ROOT_DIR, 'docs_markdown');
const BOOK_DIR = path.join(ROOT_DIR, 'book');

// Recursively find all markdown files
async function getAllMarkdownFiles(dir) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await getAllMarkdownFiles(fullPath);
      results.push(...nested);
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Extract metadata from clean markdown file
async function extractMetadata(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const relPath = path.relative(DOCS_MD_DIR, filePath).replace(/\\/g, '/');
  
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const liveUrlMatch = content.match(/> 🌐 \*\*URL en vivo:\*\*\s*\[(.*?)\]\((.*?)\)/);
  const descMatch = content.match(/> 📝 \*\*Descripción:\*\*\s*\*([^*]+)\*/);
  const sectionMatch = content.match(/> 📂 \*\*Sección:\*\*\s*(.+)$/m);

  return {
    filePath,
    relPath,
    title: titleMatch ? titleMatch[1].trim() : path.basename(filePath, '.md'),
    liveUrl: liveUrlMatch ? liveUrlMatch[2].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    section: sectionMatch ? sectionMatch[1].trim() : '',
    content
  };
}

export async function buildBook() {
  const startTime = Date.now();
  console.log('====================================================');
  console.log('📚 Generando Libro Guía Completo: Next.js v16.3.7');
  console.log('====================================================');

  await fs.mkdir(BOOK_DIR, { recursive: true });
  const allMdFiles = await getAllMarkdownFiles(DOCS_MD_DIR);
  allMdFiles.sort();

  console.log(`[1/4] Analizando ${allMdFiles.length} archivos de documentación...`);
  const docsMeta = [];
  for (const f of allMdFiles) {
    docsMeta.push(await extractMetadata(f));
  }

  // 1. Group documents by thematic book chapters
  const chapters = [
    {
      id: '01',
      filename: '01_PRIMEROS_PASOS_Y_CONFIGURACION.md',
      title: 'Capítulo 1: Primeros Pasos y Configuración Inicial',
      description: 'Instalación, estructura de proyectos, archivos de configuración, TypeScript, ESLint y primeros conceptos.',
      match: doc => doc.relPath.startsWith('01-app/01-getting-started') && (
        doc.relPath.includes('installation') ||
        doc.relPath.includes('project-structure') ||
        doc.relPath.includes('css') ||
        doc.relPath.includes('upgrading') ||
        doc.relPath.includes('proxy') ||
        doc.relPath === '01-app/01-getting-started/index.md'
      )
    },
    {
      id: '02',
      filename: '02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md',
      title: 'Capítulo 2: Enrutamiento, Layouts y Navegación (App Router)',
      description: 'Layouts anidados, páginas, navegación dinámica, Link component, Route Handlers y organización de rutas.',
      match: doc => (
        doc.relPath.startsWith('01-app/01-getting-started') && (
          doc.relPath.includes('layouts-and-pages') ||
          doc.relPath.includes('linking-and-navigating') ||
          doc.relPath.includes('route-handlers')
        )
      ) || (
        doc.relPath.startsWith('01-app/02-guides') && (
          doc.relPath.includes('instant-navigation') ||
          doc.relPath.includes('adopting-partial-prefetching') ||
          doc.relPath.includes('draft-mode') ||
          doc.relPath.includes('redirecting')
        )
      )
    },
    {
      id: '03',
      filename: '03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md',
      title: 'Capítulo 3: Server Components, Client Components y Renderizado',
      description: 'React Server Components (RSC), Client Components, patrones de composición, Streaming y Partial Prerendering (PPR).',
      match: doc => (
        doc.relPath.includes('server-and-client-components') ||
        doc.relPath.includes('partial-prerendering') ||
        doc.relPath.includes('streaming') ||
        doc.relPath.includes('lazy-loading') ||
        doc.relPath.includes('composition-patterns')
      )
    },
    {
      id: '04',
      filename: '04_DATA_FETCHING_CACHING_Y_REVALIDACION.md',
      title: 'Capítulo 4: Data Fetching, Caching Moderno y Revalidación',
      description: 'El nuevo modelo de caché de Next.js 16: Cache Components, fetch caching, revalidación bajo demanda y CDN caching.',
      match: doc => (
        doc.relPath.includes('fetching-data') ||
        doc.relPath.includes('caching') ||
        doc.relPath.includes('revalidating') ||
        doc.relPath.includes('incremental-static-regeneration') ||
        doc.relPath.includes('client-side-data-fetching')
      )
    },
    {
      id: '05',
      filename: '05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md',
      title: 'Capítulo 5: Server Actions, Formularios y Mutación de Datos',
      description: 'Manejo de mutaciones con Server Actions, estados pendientes, UI optimista, manejo de errores y validación.',
      match: doc => (
        doc.relPath.includes('mutating-data') ||
        doc.relPath.includes('forms') ||
        doc.relPath.includes('server-actions') ||
        doc.relPath.includes('error-handling')
      )
    },
    {
      id: '06',
      filename: '06_DIRECTIVAS_AVANZADAS_NEXT16.md',
      title: 'Capítulo 6: Directivas de Nueva Generación en Next.js 16',
      description: 'Guía exhaustiva de directivas: \'use cache\', \'use cache: private\', \'use cache: remote\', \'use client\' y \'use server\'.',
      match: doc => doc.relPath.startsWith('01-app/03-api-reference/01-directives')
    },
    {
      id: '07',
      filename: '07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md',
      title: 'Capítulo 7: Optimización de Assets: Imágenes, Fuentes, Scripts y SEO',
      description: 'next/image, next/font, Scripts de terceros, Metadata, Open Graph, Sitemap y Robots.txt.',
      match: doc => (
        doc.relPath.includes('images') ||
        doc.relPath.includes('fonts') ||
        doc.relPath.includes('metadata') ||
        doc.relPath.includes('scripts') ||
        doc.relPath.includes('open-graph') ||
        doc.relPath.includes('sitemap')
      )
    },
    {
      id: '08',
      filename: '08_SEGURIDAD_AUTENTICACION_Y_DATOS.md',
      title: 'Capítulo 8: Seguridad, Autenticación y Protección de Datos',
      description: 'Autenticación con Cache Components, Content Security Policy (CSP), protección contra ataques, cookies y middleware.',
      match: doc => (
        doc.relPath.includes('authentication') ||
        doc.relPath.includes('content-security-policy') ||
        doc.relPath.includes('data-security') ||
        doc.relPath.includes('environment-variables')
      )
    },
    {
      id: '09',
      filename: '09_PATRONES_AVANZADOS_E_IA.md',
      title: 'Capítulo 9: Patrones Avanzados, Agentes de IA y Arquitectura BFF',
      description: 'Desarrollo de Agentes de IA en Next.js, Backend-for-Frontend (BFF), internacionalización, testing y observabilidad.',
      match: doc => (
        doc.relPath.includes('ai-agents') ||
        doc.relPath.includes('backend-for-frontend') ||
        doc.relPath.includes('internationalization') ||
        doc.relPath.includes('testing') ||
        doc.relPath.includes('analytics') ||
        doc.relPath.includes('debugging')
      )
    },
    {
      id: '10',
      filename: '10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md',
      title: 'Capítulo 10: Despliegue, Rendimiento en Producción y Turbopack',
      description: 'Compilación con Turbopack, despliegue en Vercel, Docker y servidores propios, CI build caching y servidor personalizado.',
      match: doc => (
        doc.relPath.includes('deploying') ||
        doc.relPath.includes('turbopack') ||
        doc.relPath.includes('custom-server') ||
        doc.relPath.includes('ci-build-caching') ||
        doc.relPath.includes('building')
      )
    },
    {
      id: '11',
      filename: '11_API_REFERENCE_APP_ROUTER.md',
      title: 'Capítulo 11: Referencia de API Completa (App Router)',
      description: 'Catálogo exhaustivo de componentes integrados, convenciones de archivos, funciones de servidor, hooks y configuración.',
      match: doc => doc.relPath.startsWith('01-app/03-api-reference') && !doc.relPath.startsWith('01-app/03-api-reference/01-directives')
    },
    {
      id: '12',
      filename: '12_PAGES_ROUTER_GUIA_Y_MIGRACION.md',
      title: 'Capítulo 12: Pages Router (Soporte Legacy) y Estrategias de Migración',
      description: 'getStaticProps, getServerSideProps, getInitialProps, API Routes y guía paso a paso para migrar hacia App Router.',
      match: doc => doc.relPath.startsWith('02-pages')
    },
    {
      id: '13',
      filename: '13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md',
      title: 'Capítulo 13: Arquitectura Interna, Compilador Next.js y Comunidad',
      description: 'Next.js Compiler (SWC / Rust), Fast Refresh, compatibilidad con navegadores, guías de contribución y rspack.',
      match: doc => doc.relPath.startsWith('03-architecture') || doc.relPath.startsWith('04-community')
    }
  ];

  // 2. Generate Master Table of Contents (00_INDICE_GENERAL.md)
  console.log('[2/4] Generando Índice General del Libro...');
  let tocMd = `# 📖 Next.js v16.3.7 — Libro Guía Definitivo\n\n`;
  tocMd += `> **Compilación de la Documentación Oficial de Next.js**  \n`;
  tocMd += `> **Versión de referencia:** v16.3.7 (Última versión estable)  \n`;
  tocMd += `> **Fuente:** [https://nextjs.org/docs](https://nextjs.org/docs)  \n`;
  tocMd += `> **Total de Secciones:** ${docsMeta.length} archivos  \n\n`;
  tocMd += `Este libro guía recopila de forma estructurada, limpia y navegable toda la documentación oficial de Next.js 16.3.7. Cada sección contiene código TypeScript/JavaScript verificado, explicaciones de arquitectura y enlaces a la documentación oficial en vivo.\n\n`;
  tocMd += `---\n\n`;
  tocMd += `## 📚 Índice de Capítulos del Libro\n\n`;

  for (const chap of chapters) {
    tocMd += `### [${chap.title}](./${chap.filename})\n`;
    tocMd += `*${chap.description}*\n\n`;
  }

  tocMd += `---\n\n`;
  tocMd += `## 🗂️ Índice Detallado por Secciones Oficiales\n\n`;

  // Group by high level directory
  const topSections = {
    'App Router (01-app)': docsMeta.filter(d => d.relPath.startsWith('01-app')),
    'Pages Router (02-pages)': docsMeta.filter(d => d.relPath.startsWith('02-pages')),
    'Arquitectura e Internals (03-architecture)': docsMeta.filter(d => d.relPath.startsWith('03-architecture')),
    'Comunidad y Ecosistema (04-community)': docsMeta.filter(d => d.relPath.startsWith('04-community'))
  };

  for (const [secName, docs] of Object.entries(topSections)) {
    tocMd += `### 📁 ${secName} (${docs.length} temas)\n\n`;
    for (const d of docs) {
      const mdRelLink = `../docs_markdown/${d.relPath}`;
      tocMd += `- [**${d.title}**](${mdRelLink})`;
      if (d.description) {
        tocMd += ` — *${d.description}*`;
      }
      tocMd += `\n`;
    }
    tocMd += `\n`;
  }

  await fs.writeFile(path.join(BOOK_DIR, '00_INDICE_GENERAL.md'), tocMd, 'utf-8');

  // 3. Generate Chapter files
  console.log('[3/4] Ensamblando capítulos del libro...');
  for (const chap of chapters) {
    const chapDocs = docsMeta.filter(chap.match);
    let chapContent = `# ${chap.title}\n\n`;
    chapContent += `> 📌 **Capítulo ${chap.id}** | Libro Guía Next.js v16.3.7  \n`;
    chapContent += `> 📝 **Resumen:** *${chap.description}*  \n`;
    chapContent += `> 📄 **Temas incluidos en este capítulo:** ${chapDocs.length} secciones  \n\n`;
    chapContent += `[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)\n\n`;
    chapContent += `---\n\n`;
    chapContent += `## Contenido del Capítulo\n\n`;

    for (const d of chapDocs) {
      chapContent += `- [${d.title}](#${slugify(d.title)})\n`;
    }
    chapContent += `\n---\n\n`;

    for (const d of chapDocs) {
      chapContent += `<a id="${slugify(d.title)}"></a>\n\n`;
      // Clean body without the duplicate top level title
      const bodyWithoutTitle = d.content.replace(/^#\s+[^\n]+\n+/, '');
      chapContent += `## ${d.title}\n\n`;
      chapContent += bodyWithoutTitle + '\n\n';
      chapContent += `\n[⬆ Subir al inicio del capítulo](#)\n\n---\n\n`;
    }

    await fs.writeFile(path.join(BOOK_DIR, chap.filename), chapContent, 'utf-8');
  }

  // 4. Generate Single-File Complete Guide Book (Nextjs_16_Guia_Definitiva.md)
  console.log('[4/5] Ensamblando libro completo unificado (Nextjs_16_Guia_Definitiva.md)...');
  let fullBook = `# 📘 Next.js v16.3.7 — Libro Guía Definitivo\n\n`;
  fullBook += `> **Autoría original:** Equipo de Next.js & Vercel  \n`;
  fullBook += `> **Compilación y Adaptación:** DocsLive / Antigravity AI  \n`;
  fullBook += `> **Versión oficial documentada:** Next.js v16.3.7  \n`;
  fullBook += `> **Fecha de compilación:** ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}  \n\n`;
  fullBook += `Este libro unificado reúne los 13 capítulos fundamentales y las 456 especificaciones técnicas de la versión 16.3.7 de Next.js.\n\n`;
  fullBook += `---\n\n`;
  fullBook += `## Tabla de Contenidos\n\n`;
  for (const chap of chapters) {
    fullBook += `- [${chap.title}](#${slugify(chap.title)})\n`;
  }
  fullBook += `\n---\n\n`;

  for (const chap of chapters) {
    const chapDocs = docsMeta.filter(chap.match);
    fullBook += `<a id="${slugify(chap.title)}"></a>\n\n`;
    fullBook += `# ${chap.title}\n\n`;
    fullBook += `> *${chap.description}*\n\n`;
    fullBook += `---\n\n`;

    for (const d of chapDocs) {
      fullBook += `<a id="${slugify(d.title)}"></a>\n\n`;
      const bodyWithoutTitle = d.content.replace(/^#\s+[^\n]+\n+/, '');
      fullBook += `## ${d.title}\n\n`;
      fullBook += bodyWithoutTitle + '\n\n';
      fullBook += `\n---\n\n`;
    }
  }

  await fs.writeFile(path.join(BOOK_DIR, 'Nextjs_16_Guia_Definitiva.md'), fullBook, 'utf-8');

  // 5. Generate SUMMARY.md (Standard GitBook/mdBook format)
  console.log('[5/5] Generando SUMMARY.md para compatibilidad GitBook/mdBook...');
  let summaryMd = `# Summary\n\n`;
  summaryMd += `* [Índice General](book/00_INDICE_GENERAL.md)\n`;
  summaryMd += `* [Libro Unificado](book/Nextjs_16_Guia_Definitiva.md)\n\n`;
  for (const chap of chapters) {
    summaryMd += `* [${chap.title}](book/${chap.filename})\n`;
    const chapDocs = docsMeta.filter(chap.match);
    for (const d of chapDocs.slice(0, 10)) {
      summaryMd += `  * [${d.title}](docs_markdown/${d.relPath})\n`;
    }
    if (chapDocs.length > 10) {
      summaryMd += `  * [... y ${chapDocs.length - 10} secciones más](book/${chap.filename})\n`;
    }
  }
  await fs.writeFile(path.join(ROOT_DIR, 'SUMMARY.md'), summaryMd, 'utf-8');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\n====================================================');
  console.log(`✅ ¡Libro Guía generado con éxito en ${elapsed}s!`);
  console.log(`  • Índice General: book/00_INDICE_GENERAL.md`);
  console.log(`  • Libro Unificado: book/Nextjs_16_Guia_Definitiva.md`);
  console.log(`  • Capítulos temáticos: ${chapters.length} archivos en 'book/'`);
  console.log(`  • Secciones individuales: ${docsMeta.length} archivos en 'docs_markdown/'`);
  console.log(`  • Índice GitBook / mdBook: SUMMARY.md`);
  console.log('====================================================\n');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Execute if run directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  buildBook().catch(err => {
    console.error('Error fatal al construir el libro:', err);
    process.exit(1);
  });
}
