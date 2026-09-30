# 📚 Next.js v16.3.7 — Docs Scraper & Libro Guía Completo

[![Next.js Version](https://img.shields.io/badge/Next.js-v16.3.7%20(LTS)-black?logo=next.js)](https://nextjs.org/docs)
[![Total Sections](https://img.shields.io/badge/Secciones%20Documentadas-456%20archivos-blue)](./docs_markdown)
[![Book Chapters](https://img.shields.io/badge/Cap%C3%ADtulos%20del%20Libro-13%20Cap%C3%ADtulos-success)](./book)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow?logo=python)](https://python.org)

Proyecto integral desarrollado en **DocsLive** para scrapear, estandarizar y compilar toda la documentación oficial de **Next.js en su versión más actual (v16.3.7)**, transformándola en un **Libro Guía Definitivo** en formato Markdown puro para estudio, consulta offline y exportación a PDF/ePub.

---

## 🌟 Características Destacadas

- ⚡ **Extracción de Alta Fidelidad (v16.3.7):** 456 archivos de documentación oficial descargados directamente desde el árbol oficial con concurrencia optimizada en segundos.
- 🧹 **Sanitización Inteligente MDX ➔ Markdown:**
  - Conversión de etiquetas MDX internas (`<Check />`, `<Cross />`, `<AppOnly>`, `<PagesOnly>`, `<Image />`, `<FixCard>`) a Markdown estándar.
  - Limpieza de comentarios internos `{/* ... */}` y marcado limpio de snippets de terminal y paquetes (`pnpm`, `npm`, `yarn`, `bun`).
- 🔗 **Trazabilidad y Enlaces en Vivo:** Cada sección incluye su URL canónica oficial hacia [https://nextjs.org/docs](https://nextjs.org/docs).
- 📖 **Estructura del Libro Guía (`book/`):**
  - **[Índice General (`book/00_INDICE_GENERAL.md`)](./book/00_INDICE_GENERAL.md):** Tabla de contenidos exhaustiva con los 456 temas clasificados y vinculados.
  - **13 Capítulos Temáticos:** Agrupación pedagógica y técnica lista para lectura continua.
  - **[Libro Unificado (`book/Nextjs_16_Guia_Definitiva.md`)](./book/Nextjs_16_Guia_Definitiva.md):** El libro completo en un único archivo Markdown (~2.8 MB) ideal para lectores e-book, LLMs y compiladores PDF.
- 🌐 **Módulo de Web Scraper en Vivo:** Incluye también un scraper HTTP/DOM para rastrear y extraer contenido directamente desde `https://nextjs.org/docs`.

---

## 📁 Estructura del Repositorio

```text
DocsLive/
├── book/                                  # 📖 LIBRO GUÍA NEXT.JS 16
│   ├── 00_INDICE_GENERAL.md               # Índice maestro con enlaces a las 456 secciones
│   ├── 01_PRIMEROS_PASOS_Y_CONFIGURACION.md
│   ├── 02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md
│   ├── 03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md
│   ├── 04_DATA_FETCHING_CACHING_Y_REVALIDACION.md
│   ├── 05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md
│   ├── 06_DIRECTIVAS_AVANZADAS_NEXT16.md   # 'use cache', 'use cache private/remote'
│   ├── 07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md
│   ├── 08_SEGURIDAD_AUTENTICACION_Y_DATOS.md
│   ├── 09_PATRONES_AVANZADOS_E_IA.md      # Agentes de IA, BFF, i18n
│   ├── 10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md
│   ├── 11_API_REFERENCE_APP_ROUTER.md     # Referencia completa de API
│   ├── 12_PAGES_ROUTER_GUIA_Y_MIGRACION.md# Pages Router y migración
│   ├── 13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md
│   └── Nextjs_16_Guia_Definitiva.md       # Volumen único unificado (~2.8 MB)
│
├── docs_markdown/                         # 📝 456 ARCHIVOS .MD INDIVIDUALES
│   ├── 01-app/                            # App Router (283 archivos)
│   │   ├── 01-getting-started/            # Instalación, layouts, páginas, linking...
│   │   ├── 02-guides/                     # Guías prácticas y casos reales
│   │   └── 03-api-reference/              # Directivas, componentes, funciones, hooks
│   ├── 02-pages/                          # Pages Router (164 archivos)
│   ├── 03-architecture/                   # Arquitectura y compilador (5 archivos)
│   └── 04-community/                      # Guías de contribución (3 archivos)
│
├── docs_raw/                              # 💾 Archivos MDX originales descargados
├── scripts/                               # ⚙️ SCRIPTS DE AUTOMATIZACIÓN (Node.js)
│   ├── scrape.js                          # Descarga concurrente de v16.3.7
│   ├── clean_markdown.js                  # Conversor MDX ➔ Markdown estándar
│   ├── build_book.js                      # Generador de capítulos y libro unificado
│   ├── web_scraper.js                     # Crawler HTTP directo de nextjs.org/docs
│   └── py/                                # 🐍 Versión alternativa en Python
│       └── scrape.py
│
├── manifest_v16.3.7.json                  # Manifiesto completo de archivos en v16.3.7
├── SUMMARY.md                             # Índice compatible con GitBook / mdBook
└── package.json                           # Configuración y comandos del proyecto
```

---

## 🚀 Comandos de Ejecución

### Opción 1: Flujo Rápido (Recomendado)

Ejecuta todo el pipeline (Descarga + Sanitización + Construcción del Libro):

```bash
npm run all
```

---

### Opción 2: Pasos Individuales

#### 1. Scrapear la documentación oficial (v16.3.7):
```bash
npm run scrape
```
*(Descarga los 456 archivos oficiales en la carpeta `docs_raw/`)*

#### 2. Estandarizar a Markdown limpio:
```bash
npm run clean
```
*(Convierte los archivos a formato `.md` estándar en `docs_markdown/`)*

#### 3. Ensamblar los capítulos y el Libro Guía:
```bash
npm run build:book
```
*(Genera el índice `00_INDICE_GENERAL.md`, los 13 capítulos temáticos y `Nextjs_16_Guia_Definitiva.md` en `book/`)*

#### 4. Scraper Web directo (Opcional):
```bash
npm run web-scrape [limite_de_paginas]
```

---

## 🐍 Ejecución con Python

Si prefieres usar Python en lugar de Node.js:

```bash
# Descargar documentación
python scripts/py/scrape.py
```

---

## 📑 Temario del Libro Guía (Next.js 16.3.7)

| Capítulo | Archivo | Temas Principales |
|---|---|---|
| **01** | [`01_PRIMEROS_PASOS_Y_CONFIGURACION.md`](./book/01_PRIMEROS_PASOS_Y_CONFIGURACION.md) | Instalación con CLI, `create-next-app`, estructura del proyecto, TypeScript, ESLint. |
| **02** | [`02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md`](./book/02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md) | Enrutamiento en App Router, Layouts anidados, páginas, `<Link>`, Instant Navigation, Route Handlers. |
| **03** | [`03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md`](./book/03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md) | RSC (React Server Components), Client Components, Streaming con Suspense, Partial Prerendering (PPR). |
| **04** | [`04_DATA_FETCHING_CACHING_Y_REVALIDACION.md`](./book/04_DATA_FETCHING_CACHING_Y_REVALIDACION.md) | Nuevo modelo de caché en Next.js 16: Cache Components, revalidación bajo demanda y CDN Caching. |
| **05** | [`05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md`](./book/05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md) | Server Actions, formularios interactivos, UI optimista, manejo de errores y mutación de estado. |
| **06** | [`06_DIRECTIVAS_AVANZADAS_NEXT16.md`](./book/06_DIRECTIVAS_AVANZADAS_NEXT16.md) | Directivas `'use cache'`, `'use cache: private'`, `'use cache: remote'`, `'use client'` y `'use server'`. |
| **07** | [`07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md`](./book/07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md) | Componentes `<Image>`, `<Font>`, scripts de terceros, Metadata API, Open Graph e imágenes dinámicas. |
| **08** | [`08_SEGURIDAD_AUTENTICACION_Y_DATOS.md`](./book/08_SEGURIDAD_AUTENTICACION_Y_DATOS.md) | Autenticación con Cache Components, Content Security Policy (CSP), cookies y protección de datos. |
| **09** | [`09_PATRONES_AVANZADOS_E_IA.md`](./book/09_PATRONES_AVANZADOS_E_IA.md) | Construcción de Agentes de IA, arquitectura Backend-for-Frontend (BFF), internacionalización (i18n). |
| **10** | [`10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md`](./book/10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md) | Turbopack como bundler por defecto, despliegue en Vercel, Docker y CI Build Caching. |
| **11** | [`11_API_REFERENCE_APP_ROUTER.md`](./book/11_API_REFERENCE_APP_ROUTER.md) | Referencia exhaustiva: Funciones (`cookies`, `headers`, `redirect`), Hooks (`useRouter`, `usePathname`), Configuración (`next.config.ts`). |
| **12** | [`12_PAGES_ROUTER_GUIA_Y_MIGRACION.md`](./book/12_PAGES_ROUTER_GUIA_Y_MIGRACION.md) | Documentación completa del Pages Router tradicional y estrategia paso a paso para migrar a App Router. |
| **13** | [`13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md`](./book/13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md) | Next.js Compiler (Rust / SWC), Fast Refresh, navegadores soportados y guías de contribución. |

---

## 🖨️ Exportación a PDF o ePub

Puedes convertir el libro unificado a un documento PDF o ePub profesional utilizando herramientas estándar como **Pandoc**:

### Con Pandoc:
```bash
# Exportar a PDF
pandoc book/Nextjs_16_Guia_Definitiva.md -o Nextjs_16_Guia_Definitiva.pdf --pdf-engine=xelatex --toc

# Exportar a ePub
pandoc book/Nextjs_16_Guia_Definitiva.md -o Nextjs_16_Guia_Definitiva.epub --toc
```

### Con VS Code:
Instala la extensión **Markdown PDF** o **Markdown Preview Enhanced**, abre [`book/Nextjs_16_Guia_Definitiva.md`](./book/Nextjs_16_Guia_Definitiva.md) y selecciona `Export (pdf)`.

---

## 📜 Licencia y Créditos

- La documentación original pertenece a [Vercel Inc.](https://vercel.com) bajo licencia MIT.
- Proyecto compilado y organizado por **DocsLive**.
