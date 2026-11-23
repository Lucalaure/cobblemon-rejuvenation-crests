"""Import crest data and icons from a Pokemon Rejuvenation install.

Usage:
    python scripts/import_rejuvenation.py "C:/path/to/Rejuvenation-14.0-windows"

Writes, relative to the repo root:
  - src/main/resources/assets/rejuvcrests/textures/item/<id>.png   (icons, copied as-is)
  - src/main/resources/assets/rejuvcrests/models/item/<id>.json
  - src/main/resources/assets/rejuvcrests/lang/en_us.json          (names + tooltips)
  - src/main/resources/data/rejuvcrests/crests.json                (item id, Showdown id, holder species)

The battle effects themselves live in src/main/resources/data/rejuvcrests/held_items/*.js
and are written by hand, so this script never touches them.
"""
import json
import re
from PIL import Image  # pip install pillow
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RES = REPO / "src" / "main" / "resources"
ASSETS = RES / "assets" / "rejuvcrests"
DATA = RES / "data" / "rejuvcrests"

# Unown has only filler text; the Aevian crests need Rejuvenation-only forms Cobblemon lacks.
SKIP = {"UNOWNCREST", "AEAMPHCREST", "AECOMFCREST"}


def species_name(symbol: str) -> str:
    """:MRMIME -> mrmime (Cobblemon species ids are lowercase, no separators)."""
    return symbol.lower()


def item_id(name: str) -> str:
    """'Crabom. Crest' -> 'crabominable_crest' etc."""
    fixes = {
        "Crabom. Crest": "Crabominable Crest",
        "A. Ampharos Crest": "Aevian Ampharos Crest",
        "A. Comfey Crest": "Aevian Comfey Crest",
    }
    name = fixes.get(name, name)
    return re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_"), name


def main(game: Path) -> None:
    mods = game / "patch" / "Mods"
    itemtext = (mods / "itemtext.rb").read_text(encoding="utf-8", errors="replace")
    pbstuff = (mods / "PBStuff.rb").read_text(encoding="utf-8", errors="replace")

    block = re.search(r"POKEMONTOCREST = \{(.*?)\n  \}", pbstuff, re.S).group(1)
    crest_species: dict[str, list[str]] = {}
    for sp, crest in re.findall(r":(\w+)\s*=>\s*:(\w+)", block):
        crest_species.setdefault(crest, []).append(species_name(sp))

    crests = []
    lang = {
        "itemGroup.rejuvcrests.crests": "Rejuvenation Crests",
        "tooltip.rejuvcrests.holder": "Holder: %s",
        "item.rejuvcrests.blank_crest": "Blank Crest",
        "item.rejuvcrests.blank_crest.desc": "An empty crest. Craft it with gems and a signature item to make a crest for a specific Pokémon.",
    }
    for m in re.finditer(r"  :(\w+) => \{(.*?)\n  \},", itemtext, re.S):
        symbol, body = m.group(1), m.group(2)
        if ":crest => true" not in body or symbol in SKIP:
            continue
        raw_name = re.search(r':name => "(.*?)"', body).group(1)
        desc = re.search(r':desc => "(.*?)"', body, re.S).group(1)
        desc = desc.replace("\ufffd", "é").replace("Beheyeem", "Beheeyem").replace("Replace's", "Replaces")
        iid, name = item_id(raw_name)
        icon = None
        for base in (game / "patch" / "Graphics" / "Icons" / "Item", game / "Graphics" / "Icons" / "Item"):
            p = base / f"{symbol.lower()}.png"
            if p.exists():
                icon = p
                break
        if icon is None:
            print(f"!! no icon for {symbol}, skipping")
            continue
        species = crest_species.get(symbol, [])
        if not species:
            print(f"!! no species for {symbol}, skipping")
            continue

        # Some game icons are BMP files named .png, which Minecraft cannot read: always re-encode as real PNG.
        Image.open(icon).convert("RGBA").save(ASSETS / "textures" / "item" / f"{iid}.png", "PNG")
        (ASSETS / "models" / "item" / f"{iid}.json").write_text(
            json.dumps({"parent": "minecraft:item/generated", "textures": {"layer0": f"rejuvcrests:item/{iid}"}}, indent=2) + "\n",
            encoding="utf-8",
        )
        lang[f"item.rejuvcrests.{iid}"] = name
        lang[f"item.rejuvcrests.{iid}.desc"] = desc
        crests.append({"id": iid, "showdownId": iid.replace("_", ""), "rejuvId": symbol, "species": species})

    crests.sort(key=lambda c: c["id"])
    (DATA / "crests.json").write_text(json.dumps(crests, indent=2) + "\n", encoding="utf-8")
    (ASSETS / "lang" / "en_us.json").write_text(json.dumps(lang, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Imported {len(crests)} crests")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(Path(sys.argv[1]))
