"""Generate crafting recipes for the Blank Crest and every crest.

Usage:
    python scripts/generate_recipes.py

Each crest is crafted from a Blank Crest, gems matching its holder's types and one signature item
that fits its effect:

    A S A      S = signature item, X = Blank Crest
    B X B      mono-type holder: A and B are the same gem (7 gems)
    A B A      dual-type holder: 4 gems of the first type (A), 3 of the second (B)

The Blank Crest itself is a ring of 7 gold ingots with any evolution stone set at the bottom.
Edit TYPES / SIGNATURE below and re-run to change a recipe.
"""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RECIPES = REPO / "src" / "main" / "resources" / "data" / "rejuvcrests" / "recipe"
CRESTS = REPO / "src" / "main" / "resources" / "data" / "rejuvcrests" / "crests.json"

# Holder types as Cobblemon's battle engine has them (first species listed in crests.json).
TYPES = {
    "ariados_crest": ["bug", "poison"], "bastiodon_crest": ["rock", "steel"], "beheeyem_crest": ["psychic"],
    "boltund_crest": ["electric"], "castform_crest": ["normal"], "celebi_crest": ["psychic", "grass"],
    "cherrim_crest": ["grass"], "cinccino_crest": ["normal"], "claydol_crest": ["ground", "psychic"],
    "cofagrigus_crest": ["ghost"], "crabominable_crest": ["fighting", "ice"], "cryogonal_crest": ["ice"],
    "darmanitan_crest": ["fire"], "dedenne_crest": ["electric", "fairy"], "delcatty_crest": ["normal"],
    "druddigon_crest": ["dragon"], "dusknoir_crest": ["ghost"], "electrode_crest": ["electric"],
    "empoleon_crest": ["water", "steel"], "entei_crest": ["fire"], "fearow_crest": ["normal", "flying"],
    "feraligatr_crest": ["water"], "flareon_crest": ["fire"], "flygon_crest": ["ground", "dragon"],
    "furret_crest": ["normal"], "glaceon_crest": ["ice"], "gothitelle_crest": ["psychic"],
    "hypno_crest": ["psychic"], "infernape_crest": ["fire", "fighting"], "jolteon_crest": ["electric"],
    "leafeon_crest": ["grass"], "ledian_crest": ["bug", "flying"], "luvdisc_crest": ["water"],
    "luxray_crest": ["electric"], "magcargo_crest": ["fire", "rock"], "meganium_crest": ["grass"],
    "mightyena_crest": ["dark"], "minun_crest": ["electric"], "ninetales_crest": ["fire"],
    "noctowl_crest": ["normal", "flying"], "oricorio_crest": ["fire", "flying"], "phione_crest": ["water"],
    "plusle_crest": ["electric"], "probopass_crest": ["rock", "steel"], "raikou_crest": ["electric"],
    "rampardos_crest": ["rock"], "relicanth_crest": ["water", "rock"], "reuniclus_crest": ["psychic"],
    "runerigus_crest": ["ground", "ghost"], "samurott_crest": ["water"], "sawsbuck_crest": ["normal", "grass"],
    "seviper_crest": ["poison"], "shiinotic_crest": ["grass", "fairy"], "silvally_crest": ["normal"],
    "simipour_crest": ["water"], "simisage_crest": ["grass"], "simisear_crest": ["fire"],
    "skuntank_crest": ["poison", "dark"], "spiritomb_crest": ["ghost", "dark"], "stantler_crest": ["normal"],
    "suicune_crest": ["water"], "sunflora_crest": ["grass"], "swalot_crest": ["poison"],
    "thievul_crest": ["dark"], "torterra_crest": ["grass", "ground"], "typhlosion_crest": ["fire"],
    "vaporeon_crest": ["water"], "vespiquen_crest": ["bug", "flying"], "whiscash_crest": ["water", "ground"],
    "zangoose_crest": ["normal"], "zoroark_crest": ["dark"],
}

# One item per crest that hints at what the crest does.
SIGNATURE = {
    "ariados_crest": "cobblemon:clear_amulet",                  # speed, crits on slowed/poisoned foes
    "bastiodon_crest": "cobblemon:rocky_helmet",          # reflects damage back
    "beheeyem_crest": "minecraft:ender_eye",              # disables the attacker's move
    "boltund_crest": "cobblemon:choice_scarf",                    # biting moves
    "castform_crest": "cobblemon:heat_rock",              # sets weather on entry
    "celebi_crest": "minecraft:recovery_compass",                    # time passes twice as fast
    "cherrim_crest": "cobblemon:heat_rock",               # Flower Gift without sun
    "cinccino_crest": "cobblemon:loaded_dice",            # moves hit 2-5 times
    "claydol_crest": "cobblemon:light_clay",              # Defense-based specials, beam moves
    "cofagrigus_crest": "cobblemon:relic_coin",           # sarcophagus of riches
    "crabominable_crest": "cobblemon:choice_band",        # hits harder after taking a hit
    "cryogonal_crest": "cobblemon:never_melt_ice",        # Sp. Def feeds its other stats
    "darmanitan_crest": "cobblemon:psychic_seed",        # forced Zen Mode
    "dedenne_crest": "cobblemon:quick_claw",              # attacks with its Speed
    "delcatty_crest": "cobblemon:destiny_knot",            # power of friendship
    "druddigon_crest": "cobblemon:dragon_fang",           # Dragon/Fire boost, heals from fire
    "dusknoir_crest": "cobblemon:reaper_cloth",           # Attack and weak-move boost
    "electrode_crest": "cobblemon:air_balloon",                   # halves the target's Defense
    "empoleon_crest": "minecraft:blue_ice",               # Ice STAB, Slush Rush
    "entei_crest": "minecraft:blaze_rod",                 # Fire moves hit every foe
    "fearow_crest": "minecraft:trident",               # stabbing moves, crit ratio
    "feraligatr_crest": "cobblemon:razor_fang",           # biting moves, first-turn priority
    "flareon_crest": "cobblemon:fire_stone_block",              # Electric STAB, Speed
    "flygon_crest": "cobblemon:throat_spray",             # sound moves
    "furret_crest": "cobblemon:focus_band",              # decoy substitute on entry
    "glaceon_crest": "cobblemon:ice_stone_block",               # extra resistances, weather-free abilities
    "gothitelle_crest": "cobblemon:choice_specs",         # Dark/Psychic type swapping
    "hypno_crest": "cobblemon:blunder_policy",                 # Sp. Atk and accuracy
    "infernape_crest": "cobblemon:expert_belt",        # balanced stats, regeneration
    "jolteon_crest": "cobblemon:thunder_stone_block",           # Water STAB, Attack = Sp. Atk
    "leafeon_crest": "cobblemon:leaf_stone_block",              # extra resistances, weather-free abilities
    "ledian_crest": "cobblemon:power_bracer",           # punches hit four times
    "luvdisc_crest": "cobblemon:sweet_heart",             # power from happiness
    "luxray_crest": "cobblemon:quick_claw",                   # Normal moves become Electric
    "magcargo_crest": "minecraft:magma_cream",            # Defense/Speed swap
    "meganium_crest": "cobblemon:leftovers", # heals and protects its team
    "mightyena_crest": "cobblemon:black_glasses",         # biting moves, Speed
    "minun_crest": "cobblemon:electric_seed",              # Minus, weakens physical hits
    "ninetales_crest": "minecraft:ghast_tear",             # Ghost STAB, disables attackers
    "noctowl_crest": "cobblemon:safety_goggles",          # Defense, Sp. Def on hit
    "oricorio_crest": "cobblemon:power_anklet",          # Speed and Sp. Atk
    "phione_crest": "minecraft:nautilus_shell",             # Aqua Ring, bulk
    "plusle_crest": "cobblemon:light_ball",                 # Plus, boosts physical moves
    "probopass_crest": "cobblemon:iron_ball",             # levitates, mini noses
    "raikou_crest": "cobblemon:damp_rock",                # rain and Electric Terrain
    "rampardos_crest": "cobblemon:focus_sash",            # survives one hit, no recoil
    "relicanth_crest": "cobblemon:deep_sea_scale",        # Attack and Sp. Def
    "reuniclus_crest": "cobblemon:power_lens",            # Fighting/Psychic shifting
    "runerigus_crest": "minecraft:ominous_bottle",        # curses attackers
    "samurott_crest": "cobblemon:razor_claw",             # slicing moves always crit
    "sawsbuck_crest": "cobblemon:terrain_extender",            # seasonal type
    "seviper_crest": "cobblemon:razor_fang",             # hits healthy foes harder
    "shiinotic_crest": "cobblemon:big_root",              # stronger draining
    "silvally_crest": "cobblemon:upgrade",                # stat boost, Scrappy
    "simipour_crest": "cobblemon:leaf_stone_block",                   # Grass STAB and resistances
    "simisage_crest": "cobblemon:fire_stone_block",            # Fire STAB and resistances
    "simisear_crest": "cobblemon:water_stone_block",           # Water STAB and resistances
    "skuntank_crest": "cobblemon:smooth_rock",              # absorbs Ground moves
    "spiritomb_crest": "minecraft:soul_lantern",          # powered by fallen allies
    "stantler_crest": "cobblemon:zoom_lens",              # Attack and accuracy
    "suicune_crest": "minecraft:heart_of_the_sea",        # ignores status, Tailwind
    "sunflora_crest": "cobblemon:sun_stone_block",              # personal sunshine
    "swalot_crest": "cobblemon:black_sludge",             # Stockpile, Belch
    "thievul_crest": "cobblemon:covert_cloak",            # steals Sp. Atk on entry
    "torterra_crest": "cobblemon:shell_bell",             # inverted type chart, heals on hit
    "typhlosion_crest": "minecraft:blaze_powder",         # Attack = Sp. Atk, double contact hits
    "vaporeon_crest": "cobblemon:water_stone_block",            # Fire STAB, regeneration
    "vespiquen_crest": "minecraft:bee_nest",             # Attack/Defend Order stances
    "whiscash_crest": "cobblemon:damp_rock",               # absorbs Grass moves
    "zangoose_crest": "cobblemon:toxic_orb",              # Poison Heal
    "zoroark_crest": "cobblemon:smoke_ball",          # takes on its disguise's ability
}


def write(name: str, recipe: dict) -> None:
    (RECIPES / f"{name}.json").write_text(json.dumps(recipe, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    # Crest Emporium crests keep their types and signature items in scripts/emporium_crests.json.
    emporium = json.loads((REPO / "scripts" / "emporium_crests.json").read_text(encoding="utf-8"))
    for iid, c in emporium["crests"].items():
        TYPES[iid] = c["types"]
        SIGNATURE[iid] = c["signature"]

    crests = [c["id"] for c in json.loads(CRESTS.read_text(encoding="utf-8"))]
    missing = sorted(set(crests) - set(SIGNATURE)) + sorted(set(crests) - set(TYPES))
    if missing:
        raise SystemExit(f"No recipe data for: {missing}")

    RECIPES.mkdir(parents=True, exist_ok=True)
    for old in RECIPES.glob("*.json"):
        old.unlink()

    write("blank_crest", {
        "type": "minecraft:crafting_shaped",
        "category": "misc",
        "pattern": ["GGG", "G G", "GEG"],
        "key": {
            "G": {"item": "minecraft:gold_ingot"},
            "E": {"tag": "cobblemon:evolution_stones"},
        },
        "result": {"id": "rejuvcrests:blank_crest", "count": 1},
    })

    for crest in crests:
        types = TYPES[crest]
        first, second = types[0], types[-1]
        write(crest, {
            "type": "minecraft:crafting_shaped",
            "category": "misc",
            "pattern": ["ASA", "BXB", "ABA"],
            "key": {
                "A": {"item": f"cobblemon:{first}_gem"},
                "B": {"item": f"cobblemon:{second}_gem"},
                "S": {"item": SIGNATURE[crest]},
                "X": {"item": "rejuvcrests:blank_crest"},
            },
            "result": {"id": f"rejuvcrests:{crest}", "count": 1},
        })
    print(f"Wrote {len(crests) + 1} recipes")


if __name__ == "__main__":
    main()
