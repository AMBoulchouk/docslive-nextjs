"""
Next.js v16.3.7 Book Guide Builder (Python Edition)
Assembles clean markdown sections into an organized Book Guide ("Libro Guía Next.js 16")
"""

import os
import sys
import re
import time

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS_MD_DIR = os.path.join(ROOT_DIR, "docs_markdown")
BOOK_DIR = os.path.join(ROOT_DIR, "book")

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]+', '', text)
    return re.sub(r'\-\-+', '-', text)

def extract_meta(file_path):
    rel_path = os.path.relpath(file_path, DOCS_MD_DIR).replace("\\", "/")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    t_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    url_match = re.search(r'> 🌐 \*\*URL en vivo:\*\*\s*\[(.*?)\]\((.*?)\)', content)
    desc_match = re.search(r'> 📝 \*\*Descripción:\*\*\s*\*([^*]+)\*', content)
    sec_match = re.search(r'> 📂 \*\*Sección:\*\*\s*(.+)$', content, re.MULTILINE)

    return {
        "file_path": file_path,
        "rel_path": rel_path,
        "title": t_match.group(1).strip() if t_match else os.path.splitext(os.path.basename(file_path))[0],
        "live_url": url_match.group(2).strip() if url_match else "",
        "description": desc_match.group(1).strip() if desc_match else "",
        "section": sec_match.group(1).strip() if sec_match else "",
        "content": content
    }

def main():
    t0 = time.time()
    print("====================================================")
    print("📚 Generador de Libro Guía (Python Edition) - Next.js v16.3.7")
    print("====================================================")
    os.makedirs(BOOK_DIR, exist_ok=True)

    all_files = []
    for root, _, files in os.walk(DOCS_MD_DIR):
        for f in files:
            if f.endswith(".md"):
                all_files.append(os.path.join(root, f))
    all_files.sort()

    docs = [extract_meta(f) for f in all_files]
    print(f"[1/4] Analizados {len(docs)} archivos de documentación...")

    chapters = [
        {
            "id": "01",
            "filename": "01_PRIMEROS_PASOS_Y_CONFIGURACION.md",
            "title": "Capítulo 1: Primeros Pasos y Configuración Inicial",
            "description": "Instalación, estructura de proyectos, archivos de configuración, TypeScript, ESLint y primeros conceptos.",
            "match": lambda d: d["rel_path"].startswith("01-app/01-getting-started") and any(k in d["rel_path"] for k in ["installation", "project-structure", "css", "upgrading", "proxy"])
        },
        {
            "id": "02",
            "filename": "02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md",
            "title": "Capítulo 2: Enrutamiento, Layouts y Navegación (App Router)",
            "description": "Layouts anidados, páginas, navegación dinámica, Link component, Route Handlers y organización de rutas.",
            "match": lambda d: (d["rel_path"].startswith("01-app/01-getting-started") and any(k in d["rel_path"] for k in ["layouts-and-pages", "linking-and-navigating", "route-handlers"])) or (d["rel_path"].startswith("01-app/02-guides") and any(k in d["rel_path"] for k in ["instant-navigation", "adopting-partial-prefetching", "draft-mode", "redirecting"]))
        },
        {
            "id": "03",
            "filename": "03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md",
            "title": "Capítulo 3: Server Components, Client Components y Renderizado",
            "description": "React Server Components (RSC), Client Components, patrones de composición, Streaming y Partial Prerendering (PPR).",
            "match": lambda d: any(k in d["rel_path"] for k in ["server-and-client-components", "partial-prerendering", "streaming", "lazy-loading", "composition-patterns"])
        },
        {
            "id": "04",
            "filename": "04_DATA_FETCHING_CACHING_Y_REVALIDACION.md",
            "title": "Capítulo 4: Data Fetching, Caching Moderno y Revalidación",
            "description": "El nuevo modelo de caché de Next.js 16: Cache Components, fetch caching, revalidación bajo demanda y CDN caching.",
            "match": lambda d: any(k in d["rel_path"] for k in ["fetching-data", "caching", "revalidating", "incremental-static-regeneration", "client-side-data-fetching"])
        },
        {
            "id": "05",
            "filename": "05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md",
            "title": "Capítulo 5: Server Actions, Formularios y Mutación de Datos",
            "description": "Manejo de mutaciones con Server Actions, estados pendientes, UI optimista, manejo de errores y validación.",
            "match": lambda d: any(k in d["rel_path"] for k in ["mutating-data", "forms", "server-actions", "error-handling"])
        },
        {
            "id": "06",
            "filename": "06_DIRECTIVAS_AVANZADAS_NEXT16.md",
            "title": "Capítulo 6: Directivas de Nueva Generación en Next.js 16",
            "description": "Guía exhaustiva de directivas: 'use cache', 'use cache: private', 'use cache: remote', 'use client' y 'use server'.",
            "match": lambda d: d["rel_path"].startswith("01-app/03-api-reference/01-directives")
        },
        {
            "id": "07",
            "filename": "07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md",
            "title": "Capítulo 7: Optimización de Assets: Imágenes, Fuentes, Scripts y SEO",
            "description": "next/image, next/font, Scripts de terceros, Metadata, Open Graph, Sitemap y Robots.txt.",
            "match": lambda d: any(k in d["rel_path"] for k in ["images", "fonts", "metadata", "scripts", "open-graph", "sitemap"])
        },
        {
            "id": "08",
            "filename": "08_SEGURIDAD_AUTENTICACION_Y_DATOS.md",
            "title": "Capítulo 8: Seguridad, Autenticación y Protección de Datos",
            "description": "Autenticación con Cache Components, Content Security Policy (CSP), protección contra ataques, cookies y middleware.",
            "match": lambda d: any(k in d["rel_path"] for k in ["authentication", "content-security-policy", "data-security", "environment-variables"])
        },
        {
            "id": "09",
            "filename": "09_PATRONES_AVANZADOS_E_IA.md",
            "title": "Capítulo 9: Patrones Avanzados, Agentes de IA y Arquitectura BFF",
            "description": "Desarrollo de Agentes de IA en Next.js, Backend-for-Frontend (BFF), internacionalización, testing y observabilidad.",
            "match": lambda d: any(k in d["rel_path"] for k in ["ai-agents", "backend-for-frontend", "internationalization", "testing", "analytics", "debugging"])
        },
        {
            "id": "10",
            "filename": "10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md",
            "title": "Capítulo 10: Despliegue, Rendimiento en Producción y Turbopack",
            "description": "Compilación con Turbopack, despliegue en Vercel, Docker y servidores propios, CI build caching y servidor personalizado.",
            "match": lambda d: any(k in d["rel_path"] for k in ["deploying", "turbopack", "custom-server", "ci-build-caching", "building"])
        },
        {
            "id": "11",
            "filename": "11_API_REFERENCE_APP_ROUTER.md",
            "title": "Capítulo 11: Referencia de API Completa (App Router)",
            "description": "Catálogo exhaustivo de componentes integrados, convenciones de archivos, funciones de servidor, hooks y configuración.",
            "match": lambda d: d["rel_path"].startswith("01-app/03-api-reference") and not d["rel_path"].startswith("01-app/03-api-reference/01-directives")
        },
        {
            "id": "12",
            "filename": "12_PAGES_ROUTER_GUIA_Y_MIGRACION.md",
            "title": "Capítulo 12: Pages Router (Soporte Legacy) y Estrategias de Migración",
            "description": "getStaticProps, getServerSideProps, getInitialProps, API Routes y guía paso a paso para migrar hacia App Router.",
            "match": lambda d: d["rel_path"].startswith("02-pages")
        },
        {
            "id": "13",
            "filename": "13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md",
            "title": "Capítulo 13: Arquitectura Interna, Compilador Next.js y Comunidad",
            "description": "Next.js Compiler (SWC / Rust), Fast Refresh, compatibilidad con navegadores, guías de contribución y rspack.",
            "match": lambda d: d["rel_path"].startswith("03-architecture") or d["rel_path"].startswith("04-community")
        }
    ]

    print("[2/4] Generando Índice General...")
    toc_lines = [
        f"# 📖 Next.js v16.3.7 — Libro Guía Definitivo\n",
        f"> **Compilación de la Documentación Oficial de Next.js**  \n",
        f"> **Versión de referencia:** v16.3.7  \n",
        f"> **Fuente:** [https://nextjs.org/docs](https://nextjs.org/docs)  \n",
        f"> **Total de Secciones:** {len(docs)} archivos  \n\n",
        f"Este libro guía recopila de forma estructurada, limpia y navegable toda la documentación oficial de Next.js 16.3.7.\n\n",
        f"---\n\n",
        f"## 📚 Índice de Capítulos del Libro\n\n"
    ]
    for ch in chapters:
        toc_lines.append(f"### [{ch['title']}](./{ch['filename']})\n*{ch['description']}*\n\n")

    toc_lines.append("---\n\n## 🗂️ Índice Detallado por Secciones Oficiales\n\n")
    sections_map = {
        "App Router (01-app)": [d for d in docs if d["rel_path"].startswith("01-app")],
        "Pages Router (02-pages)": [d for d in docs if d["rel_path"].startswith("02-pages")],
        "Arquitectura e Internals (03-architecture)": [d for d in docs if d["rel_path"].startswith("03-architecture")],
        "Comunidad y Ecosistema (04-community)": [d for d in docs if d["rel_path"].startswith("04-community")]
    }
    for sec_title, sec_docs in sections_map.items():
        toc_lines.append(f"### 📁 {sec_title} ({len(sec_docs)} temas)\n\n")
        for d in sec_docs:
            desc_part = f" — *{d['description']}*" if d['description'] else ""
            toc_lines.append(f"- [**{d['title']}**](../docs_markdown/{d['rel_path']}){desc_part}\n")
        toc_lines.append("\n")

    with open(os.path.join(BOOK_DIR, "00_INDICE_GENERAL.md"), "w", encoding="utf-8") as f:
        f.writelines(toc_lines)

    print("[3/4] Ensamblando capítulos individuales...")
    for ch in chapters:
        matched = [d for d in docs if ch["match"](d)]
        ch_lines = [
            f"# {ch['title']}\n\n",
            f"> 📌 **Capítulo {ch['id']}** | Libro Guía Next.js v16.3.7  \n",
            f"> 📝 **Resumen:** *{ch['description']}*  \n",
            f"> 📄 **Temas incluidos:** {len(matched)} secciones  \n\n",
            f"[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)\n\n",
            f"---\n\n",
            f"## Contenido del Capítulo\n\n"
        ]
        for d in matched:
            ch_lines.append(f"- [{d['title']}](#{slugify(d['title'])})\n")
        ch_lines.append("\n---\n\n")

        for d in matched:
            body_clean = re.sub(r'^#\s+[^\n]+\n+', '', d["content"])
            ch_lines.append(f'<a id="{slugify(d["title"])}"></a>\n\n')
            ch_lines.append(f"## {d['title']}\n\n{body_clean}\n\n")
            ch_lines.append("[⬆ Subir al inicio del capítulo](#)\n\n---\n\n")

        with open(os.path.join(BOOK_DIR, ch["filename"]), "w", encoding="utf-8") as f:
            f.writelines(ch_lines)

    print(f"\n[4/4] ¡Listo! Libro generado en {time.time()-t0:.2f}s en '{BOOK_DIR}'")
    print("====================================================\n")

if __name__ == "__main__":
    main()
