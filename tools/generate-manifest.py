from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
PHOTOS_DIR = ROOT / "assets" / "photos"
MANIFEST_PATH = PHOTOS_DIR / "manifest.json"

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def prettify_name(folder_name: str) -> str:
    return folder_name.replace("-", " ").replace("_", " ").title()

def build_manifest():
    albums = []

    for folder in sorted(PHOTOS_DIR.iterdir()):
      if not folder.is_dir():
          continue

      files = sorted(
          [
              f for f in folder.iterdir()
              if f.is_file() and f.suffix.lower() in IMAGE_EXTS
          ]
      )

      if not files:
          continue

      rel_files = [
          f"./assets/photos/{folder.name}/{f.name}"
          for f in files
      ]

      album = {
          "id": folder.name,
          "name": prettify_name(folder.name),
          "desc": f"{prettify_name(folder.name)} album",
          "cover": rel_files[0],
          "files": rel_files
      }

      albums.append(album)

    manifest = {"albums": albums}

    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print(f"Generated: {MANIFEST_PATH}")
    print(f"Albums: {len(albums)}")

if __name__ == "__main__":
    build_manifest()