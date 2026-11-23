/*
 * Dedenne Crest (Pokemon Rejuvenation)
 * Dedenne's Physical attacks use its Speed stat rather than Attack stat.
 */
{
	name: "Dedenne Crest",
	spritenum: 0,
	itemUser: ["Dedenne"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Dedenne');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dedenne') && move.category !== 'Status' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'spe';
	},
	num: -2015,
	gen: 9,
}
