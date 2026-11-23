/*
 * Cinccino Crest (Pokemon Rejuvenation)
 * All single target moves turn into multi-hit moves (2-5 hits at 40% the BP).
 */
{
	name: "Cinccino Crest",
	spritenum: 0,
	itemUser: ["Cinccino"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Cinccino');
	},
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Cinccino') || move.category === 'Status' || move.multihit) return;
		if (!['normal', 'any', 'adjacentFoe', 'randomNormal'].includes(move.target)) return;
		if (move.flags['charge'] || move.flags['futuremove'] || move.isZ || move.isMax) return;
		move.multihit = [2, 5];
		move.multihitType = 'rejuvcrest';
	},
	onBasePowerPriority: 7,
	onBasePower(basePower, pokemon, target, move) {
		if (move.multihitType === 'rejuvcrest' && (pokemon.baseSpecies.baseSpecies === 'Cinccino')) return this.chainModify(0.4);
	},
	onSourceModifySecondaries(secondaries, target, source, move) {
		if (move.multihitType === 'rejuvcrest' && move.hit > 1) return [];
	},
	num: -2009,
	gen: 9,
}
