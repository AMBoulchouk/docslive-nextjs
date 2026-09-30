"""
Next.js Docs MDX to Clean Markdown Converter (Python Edition)
Converts raw MDX docs into standardized, clean GitHub Flavored Markdown (.md)
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
DOCS_RAW_DIR = os.path.join(ROOT_DIR, "docs_raw")
DOCS_MD_DIR = os.path.join(ROOT_DIR, "docs_markdown")

def doc_path_to_live_url(rel_path):
    clean = re.sub(r'\.mdx?$', '', rel_path)
    segments = [re.sub(r'^\d+-', '', s) for s in re.split(r'[\\/]', clean)]
    if segments and segments[-1] == 'index':
        segments.pop()
    return f"https://nextjs.org/docs/{'/'.join(segments)}"

def get_breadcrumbs(rel_path):
    parts = re.split(r'[\\/]', rel_path)
    titles = []
    for seg in parts[:-1]:
        clean_seg = re.sub(r'^\d+-', '', seg)
        clean_seg = ' '.join(w.capitalize() for w in clean_seg.split('-'))
        titles.append(clean_seg)
    return ' > '.join(titles) if titles else 'General'

def parse_frontmatter(text):
    m = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.DOTALL)
    if not m:
        return {}, text
    fm_block = m.group(1)
    body = text[m.end():]
    fm = {}
    current_key = None
    for line in fm_block.splitlines():
        kv = re.match(r'^([a-zA-Z0-9_-]+):\s*(.*)$', line)
        if kv:
            current_key = kv.group(1)
            val = kv.group(2).strip()
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            fm[current_key] = val
        elif current_key and line.startswith('  '):
            fm[current_key] += ' ' + line.strip()
    return fm, body

def clean_mdx_content(body, is_app, is_pages):
    text = body
    # 1. Remove MDX comments
    text = re.sub(r'\{\s*/\*.*?\*/\s*\}', '', text, flags=re.DOTALL)

    # 2. AppOnly / PagesOnly
    if is_app:
        text = re.sub(r'</?AppOnly>', '', text)
        def repl_pages(m):
            inner = m.group(1).strip()
            if not inner:
                return ''
            quoted = '\n'.join(f'> {line}' for line in inner.splitlines())
            return f"\n\n> 📘 **Nota para Pages Router:**\n{quoted}\n\n"
        text = re.sub(r'<PagesOnly>(.*?)</PagesOnly>', repl_pages, text, flags=re.DOTALL)
    elif is_pages:
        text = re.sub(r'</?PagesOnly>', '', text)
        def repl_app(m):
            inner = m.group(1).strip()
            if not inner:
                return ''
            quoted = '\n'.join(f'> {line}' for line in inner.splitlines())
            return f"\n\n> 📗 **Nota para App Router:**\n{quoted}\n\n"
        text = re.sub(r'<AppOnly>(.*?)</AppOnly>', repl_app, text, flags=re.DOTALL)
    else:
        text = re.sub(r'</?AppOnly>', '', text)
        text = re.sub(r'</?PagesOnly>', '', text)

    # 3. Check / Cross
    text = re.sub(r'<Check\s*/?>', '✅', text)
    text = re.sub(r'<Cross\s*/?>', '❌', text)

    # 4. Images
    def repl_img(m):
        attrs = m.group(1)
        alt_m = re.search(r'alt=["\']([^"\']*)["\']', attrs)
        src_m = re.search(r'src=["\']([^"\']*)["\']', attrs)
        alt = alt_m.group(1) if alt_m else 'Illustration'
        src = src_m.group(1) if src_m else ''
        if src.startswith('/'):
            src = f"https://nextjs.org{src}"
        return f"\n\n![{alt}]({src})\n\n"
    text = re.sub(r'<Image\s+([^>]*?)/?>', repl_img, text)

    # 5. Links
    text = re.sub(r'<Link\s+href=["\']([^"\']+)["\']>(.*?)</Link>', r'[\2](\1)', text, flags=re.DOTALL)

    # 6. FixCard (including self-closing multi-line)
    text = re.sub(r'</?FixCardGrid>', '', text)
    def repl_fc(m):
        attrs = m.group(1)
        title_m = re.search(r'title=["\']([^"\']*)["\']', attrs)
        href_m = re.search(r'href=["\']([^"\']*)["\']', attrs)
        group_m = re.search(r'group=["\']([^"\']*)["\']', attrs)
        title = title_m.group(1) if title_m else 'Solución'
        group = f" ({group_m.group(1)})" if group_m else ""
        link_str = ""
        if href_m:
            h = href_m.group(1)
            full_h = f"https://nextjs.org{h}" if h.startswith('/') else h
            link_str = f" — [Ver guía de solución]({full_h})"
        return f"\n> 💡 **Solución recomendada{group}:** {title}{link_str}\n"

    text = re.sub(r'<FixCard\s+([\s\S]*?)(?:>[\s\S]*?</FixCard>|/>)', repl_fc, text)
    text = re.sub(r'<(Details|Suspense|DataChild|SearchBar|Item|List|Video)\b([^>]*?)(?:/>|>[\s\S]*?</\1>)', r'`<\1 />`', text)
    text = re.sub(r'</?(Details|Suspense|DataChild|SearchBar|Item|List|Video)\b[^>]*?>', r'`<\1>`', text)

    # 7. Code block fence labels
    text = re.sub(r'^```([a-zA-Z0-9_-]+)\s+package=["\']([^"\']+)["\']', r'```\1\n# Manejador de paquetes: \2', text, flags=re.MULTILINE)
    text = re.sub(r'^```([a-zA-Z0-9_-]+)\s+filename=["\']([^"\']+)["\']', r'```\1\n// Archivo: \2', text, flags=re.MULTILINE)

    # 8. Blank lines
    text = re.sub(r'\n{4,}', '\n\n', text)
    return text.strip()

def main():
    t0 = time.time()
    print("====================================================")
    print("🧹 Limpieza MDX -> Markdown (Python Edition)")
    print("====================================================")
    all_files = []
    for root, _, files in os.walk(DOCS_RAW_DIR):
        for f in files:
            if f.endswith(('.md', '.mdx')):
                all_files.append(os.path.join(root, f))

    print(f"[1/2] Procesando {len(all_files)} archivos...")
    for idx, raw_path in enumerate(all_files, 1):
        rel_path = os.path.relpath(raw_path, DOCS_RAW_DIR)
        is_app = rel_path.startswith("01-app")
        is_pages = rel_path.startswith("02-pages")

        with open(raw_path, "r", encoding="utf-8") as fp:
            raw_content = fp.read()

        fm, body = parse_frontmatter(raw_content)
        cleaned_body = clean_mdx_content(body, is_app, is_pages)

        live_url = doc_path_to_live_url(rel_path)
        breadcrumb = get_breadcrumbs(rel_path)
        title = fm.get("title") or os.path.splitext(os.path.basename(rel_path))[0]
        desc = fm.get("description", "")

        header = f"# {title}\n\n"
        header += f"> **Documentación Oficial Next.js v16.3.7**  \n"
        header += f"> 🌐 **URL en vivo:** [{live_url}]({live_url})  \n"
        header += f"> 📂 **Sección:** {breadcrumb}  \n"
        if desc:
            header += f"> 📝 **Descripción:** *{desc}*  \n"
        header += "\n---\n\n"

        final_md = header + cleaned_body + "\n"
        target_rel = re.sub(r'\.mdx$', '.md', rel_path)
        target_path = os.path.join(DOCS_MD_DIR, target_rel)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as out:
            out.write(final_md)

        if idx % 50 == 0 or idx == len(all_files):
            pct = int((idx / len(all_files)) * 100)
            print(f"\r  Progreso: {idx}/{len(all_files)} ({pct}%)", end="", flush=True)

    print(f"\n\n[2/2] Completado en {time.time()-t0:.2f}s en '{DOCS_MD_DIR}'")
    print("====================================================\n")

if __name__ == "__main__":
    main()
