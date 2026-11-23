/*
 * Ledian Crest (Pokemon Rejuvenation)
 * Ledian punches four times at once. Secondary effects only occur on the first two hits.
 */
{
	name: "Ledian Crest",
	spritenum: 0,
	itemUser: ["Ledian"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Ledian');
	},
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Ledian') || !move.flags['punch'] || move.category === 'Status' || move.multihit) return;
		move.multihit = 4;
		move.multihitType = 'rejuvcrest';
	},
	onSourceModifySecondaries(secondaries, target, source, move) {
		if (move.multihitType === 'rejuvcrest' && move.hit > 2) return [];
	},
	num: -2033,
	gen: 9,
}
