"""Add the Crest Emporium crests (a Pokemon Rejuvenation add-on by KolinKat) to the mod's data.

Usage (after import_rejuvenation.py, which this builds on):
    python scripts/import_emporium.py "C:/path/to/extracted/Crest Emporium"

Reads scripts/emporium_crests.json (names, holders, descriptions, icon file names) and:
  - copies each crest's icon from Graphics/Icons/Item/ into the mod's textures,
  - writes item models,
  - merges the crests into data/rejuvcrests/crests.json (marked "source": "emporium"),
  - adds names/descriptions to en_us.json, plus the female-holder descriptions for the
    Rejuvenation crests that Emporium gives a female-only effect.

Battle effects live in data/rejuvcrests/held_items/*.js and are not touched.
"""
import json
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RES = REPO / "src" / "main" / "resources"
ASSETS = RES / "assets" / "rejuvcrests"
DATA = RES / "data" / "rejuvcrests"
TABLE = REPO / "scripts" / "emporium_crests.json"


def main(emporium: Path) -> None:
    table = json.loads(TABLE.read_text(encoding="utf-8"))
    crests = json.loads((DATA / "crests.json").read_text(encoding="utf-8"))
    lang_path = ASSETS / "lang" / "en_us.json"
    lang = json.loads(lang_path.read_text(encoding="utf-8"))

    crests = [c for c in crests if c.get("source") != "emporium"]
    lang["tooltip.rejuvcrests.emporium"] = "Crest Emporium by KolinKat"
    for iid, c in table["crests"].items():
        icon = emporium / "Graphics" / "Icons" / "Item" / f"{c['icon']}.png"
        if not icon.exists():
            raise SystemExit(f"Missing icon {icon}")
        shutil.copyfile(icon, ASSETS / "textures" / "item" / f"{iid}.png")
        (ASSETS / "models" / "item" / f"{iid}.json").write_text(
            json.dumps({"parent": "minecraft:item/generated", "textures": {"layer0": f"rejuvcrests:item/{iid}"}}, indent=2) + "\n",
            encoding="utf-8",
        )
        lang[f"item.rejuvcrests.{iid}"] = c["name"]
        lang[f"item.rejuvcrests.{iid}.desc"] = c["desc"]
        crests.append({"id": iid, "showdownId": iid.replace("_", ""), "source": "emporium", "species": c["species"]})

    for iid, desc in table["female"].items():
        lang[f"item.rejuvcrests.{iid}.desc_female"] = desc

    crests.sort(key=lambda c: c["id"])
    (DATA / "crests.json").write_text(json.dumps(crests, indent=2) + "\n", encoding="utf-8")
    lang_path.write_text(json.dumps(lang, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Merged {len(table['crests'])} Crest Emporium crests ({len(crests)} total)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
