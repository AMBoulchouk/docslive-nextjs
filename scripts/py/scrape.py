"""
Next.js v16.3.7 Documentation Scraper (Python Edition)
Fetches all official documentation files for v16.3.7 directly from source.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

TAG = "v16.3.7"
REPO = "vercel/next.js"
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DOCS_RAW_DIR = os.path.join(ROOT_DIR, "docs_raw")
MANIFEST_PATH = os.path.join(ROOT_DIR, "manifest_v16.3.7.json")
TREE_API = f"https://api.github.com/repos/{REPO}/git/trees/{TAG}?recursive=1"
RAW_BASE = f"https://raw.githubusercontent.com/{REPO}/{TAG}/"

def get_manifest():
    print(f"[1/3] Obteniendo lista de archivos para Next.js {TAG}...")
    req = urllib.request.Request(TREE_API, headers={"User-Agent": "DocsLive-Scraper/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            files = [
                item for item in data.get("tree", [])
                if item["path"].startswith("docs/") and item["path"].endswith((".md", ".mdx"))
            ]
            print(f"  ✓ {len(files)} archivos encontrados vía GitHub API.")
            with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
                json.dump(files, f, indent=2)
            return files
    except Exception as e:
        print(f"  ! Usando manifiesto local: {e}")
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

def download_one(item):
    doc_path = item["path"]
    rel_path = doc_path.replace("docs/", "")
    target_path = os.path.join(DOCS_RAW_DIR, os.path.normpath(rel_path))
    os.makedirs(os.path.dirname(target_path), exist_ok=True)

    if os.path.exists(target_path):
        return ("skip", doc_path)

    url = f"{RAW_BASE}{doc_path}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                content = resp.read()
                with open(target_path, "wb") as f:
                    f.write(content)
                return ("ok", doc_path)
        except Exception:
            if attempt == 2:
                return ("error", doc_path)
            time.sleep(1)

def main():
    t0 = time.time()
    print("====================================================")
    print(f"🚀 Iniciando Scraper en Python - Next.js {TAG}")
    print("====================================================")
    os.makedirs(DOCS_RAW_DIR, exist_ok=True)
    files = get_manifest()

    print(f"\n[2/3] Descargando {len(files)} archivos con ThreadPoolExecutor...")
    downloaded, skipped, failed = 0, 0, 0
    with ThreadPoolExecutor(max_workers=15) as executor:
        futures = [executor.submit(download_one, item) for item in files]
        for idx, fut in enumerate(as_completed(futures), 1):
            status, doc_path = fut.result()
            if status == "ok":
                downloaded += 1
            elif status == "skip":
                skipped += 1
            else:
                failed += 1
            if idx % 25 == 0 or idx == len(files):
                pct = int((idx / len(files)) * 100)
                print(f"\r  Progreso: {idx}/{len(files)} ({pct}%) - Descargados: {downloaded}, Omitidos: {skipped}", end="", flush=True)

    elapsed = time.time() - t0
    print(f"\n\n[3/3] Finalizado en {elapsed:.2f}s:")
    print(f"  • Total: {len(files)} | Nuevos: {downloaded} | Omitidos: {skipped} | Fallos: {failed}")
    print("====================================================\n")

if __name__ == "__main__":
    main()
