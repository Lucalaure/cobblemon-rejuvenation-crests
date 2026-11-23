# Rejuvenation Crests for Cobblemon

A Fabric add-on for [Cobblemon](https://cobblemon.com) that adds the **Crests** from Pokémon Rejuvenation: held items that give one specific Pokémon a unique buff.

- Minecraft 1.21.1, Fabric Loader 0.16+, Fabric API, Fabric Language Kotlin
- Cobblemon 1.8.0+ (built against 1.8.4)

## What's in it

119 crest items:

- **71 from Rejuvenation 14**: every crest that works on a standard Pokémon. Left out: the Aevian Ampharos and Aevian Comfey crests (they need Rejuvenation-only forms) and Unown's crest (the game only has filler text for it).
- **48 from Crest Emporium**, KolinKat's Rejuvenation add-on, from Parasect and Delibird to Tyrantrum and Frosmoth. Left out: the crests built around Rejuvenation's field effects or custom items (Froslass, Trevenant, Porygon-Z, Lumineon, Kecleon, Furfrou, Wormadam, Vivillon, Mascot), Grumpig's crest (disabled in Emporium itself), and the Aevian and regional parts of the Leavanny, Sigilyph, Stunfisk and Avalugg crests.

Crest Emporium also gives **female** Furret, Sunflora, Sawsbuck, Plusle and Minun a different crest effect. Here it's the same item: female holders get the Emporium effect, others keep the Rejuvenation one, and the tooltip shows both.

Each crest has:

- its original icon from the game or from Crest Emporium,
- a tooltip showing which Pokémon it's for and what it does,
- a battle effect written as a Showdown item script, which Cobblemon's battle engine loads.

The crests show up in their own creative tab, **Rejuvenation Crests**, and can be given with `/give @s rejuvcrests:typhlosion_crest`.

## Crafting

First craft a **Blank Crest**: 7 gold ingots, a diamond in the centre and any evolution stone at the top.

```
G E G     G = gold ingot, E = any evolution stone, D = diamond
G D G
G G G
```

Then put the Blank Crest in the centre and surround it with gems matching the holder's types, plus one signature item at the top that hints at what the crest does:

```
A S A     X = Blank Crest, S = signature item
B X B     A = gem of the holder's first type (4)
A B A     B = gem of its second type (3), or the same gem again for single-type holders
```

These are normal crafting-table recipes, so recipe viewers like JEI, REI and EMI show them automatically.

For example, the Typhlosion Crest takes 7 Fire Gems and Blaze Powder, and the Luxray Crest takes 7 Electric Gems and a Magnet. Signature items are listed in `scripts/generate_recipes.py` (Rejuvenation crests) and `scripts/emporium_crests.json` (Crest Emporium crests). Edit them and re-run `python scripts/generate_recipes.py` to change any recipe.

As in Rejuvenation, a crest only works on the Pokémon it's made for, and it can't be knocked off, stolen or swapped away from that Pokémon.

## How it works

| Part | Where |
| --- | --- |
| Item registration, tooltip, creative tab | `src/main/java/io/github/lucalaure/rejuvcrests/` |
| Crest list (item id → Showdown id → holder species) | `src/main/resources/data/rejuvcrests/crests.json` |
| Battle effects, one file per crest | `src/main/resources/data/rejuvcrests/held_items/*.js` |
| Icons, models, names and descriptions | `src/main/resources/assets/rejuvcrests/` |

Cobblemon loads every `data/<namespace>/held_items/*.js` file into its Showdown engine as a held item. It strips line breaks before loading, so **only use `/* */` comments in these scripts**: a `//` comment would swallow the rest of the file. The mod then maps each Minecraft item to its script with `CobblemonHeldItemManager.registerRemap`.

The numbers come from the games' own battle code (Rejuvenation's `Scripts/Rejuv/Battle/Battler.rb#crestStats` and `Battle_Move.rb`, Crest Emporium's `Mods/cceCrest*.rb`), not just the in-game descriptions.

## Differences from Rejuvenation

Cobblemon has no field effects, Aevian forms or Rejuvenation-only moves, so some crests are adapted:

- **Silvally Crest**: Silvally can't hold a Memory as well as the crest, so it always gets the no-Memory bonus (Scrappy) plus the 1.2× Attack and Sp. Atk.
- **Castform Crest**: sets the weather from its first weather move and gives the Forecast forms their weather abilities (Solar Power, Rain Dish, Slush Rush). The custom base stats for each form aren't applied.
- **Probopass Crest**: the "mini noses" follow-up shows up as a 3-hit, 20 BP special Bullet Seed using whichever of Steel, Rock or Electric hits hardest.
- **Zoroark Crest**: the disguised Pokémon's ability is added on top of Illusion instead of replacing it.
- **Suicune Crest**: ignores status damage and the burn and paralysis stat drops, and can act while asleep, frozen or paralysed. It still can't act through infatuation.
- **Darmanitan Crest** only applies to Unovan Darmanitan; **Typhlosion, Samurott and Electrode crests** only apply to the non-Hisuian forms, as in Rejuvenation.
- Field-specific interactions are ignored.

Crest Emporium crests adapted to Cobblemon:

- **Girafarig Crest**: Girafarig's second, inverted-type hit works, but it doesn't swap its own form or typing defensively.
- **Delibird Crest**: Present is a fixed 90-power Ice move (Emporium's reworked Present) instead of the random-power move.
- **Minior Crest**: core colours map to Red → Fire, Orange → Steel, Yellow → Electric, Green → Grass, Blue → Water, Indigo → Dark, Violet → Poison.
- **Parasect / Beautifly / Lanturn crests**: stat drains on the foe last until that foe switches out.
- **Xatu Crest**: Xatu always keeps one Future Sight pending, and is rewarded when Future Sight knocks a foe out.

## Building

```powershell
./gradlew build
```

The jar ends up in `build/libs/`.

## Re-importing from the game

`scripts/import_rejuvenation.py` copies the icons and rebuilds the names, descriptions and `crests.json` from a Rejuvenation install. It doesn't touch the battle scripts.

```powershell
python scripts/import_rejuvenation.py "C:/path/to/Rejuvenation-14.0-windows"
```

Then add the Crest Emporium crests back on top (the Rejuvenation import rewrites `crests.json`), using the extracted Emporium folder, and regenerate the recipes:

```powershell
python scripts/import_emporium.py "C:/path/to/Crest Emporium"
```

```powershell
python scripts/generate_recipes.py
```

## Testing the battle scripts

`scripts/test_crests.js` runs real battles in Cobblemon's bundled Showdown engine, outside Minecraft. It checks that every crest loads and runs on its holder, and it also runs a set of behaviour checks. Extract `data/cobblemon/showdown.zip` from the Cobblemon jar first, then run:

```powershell
node scripts/test_crests.js <extracted showdown folder> src/main/resources/data/rejuvcrests/held_items
```

## Credits

Crest designs, names, descriptions and icons are from **Pokémon Rejuvenation** by Jan and the Rejuvenation team, and from **Crest Emporium** by KolinKat. Pokémon is © Nintendo / Game Freak / The Pokémon Company. This is a fan project, not affiliated with any of them.
