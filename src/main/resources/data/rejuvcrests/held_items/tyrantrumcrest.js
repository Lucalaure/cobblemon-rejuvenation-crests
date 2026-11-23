/*
 * Tyrantrum Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * All attacks of 120 power or less become 120 power, but lock it into a rampage.
 */
{
	name: "Tyrantrum Crest",
	spritenum: 0,
	itemUser: ["Tyrantrum"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Tyrantrum');
	},
	onBasePowerPriority: 40,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Tyrantrum') && basePower > 0 && basePower <= 120) return 120;
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Tyrantrum') || move.category === 'Status' || source.volatiles['lockedmove'] || move.isExternal) return;
		source.addVolatile('lockedmove');
	},
	num: -3041,
	gen: 9,
}
