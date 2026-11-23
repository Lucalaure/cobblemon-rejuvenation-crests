/*
 * Ambipom Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Moves of 60 power or less hit twice; the second hit deals a quarter of the damage.
 */
{
	name: "Ambipom Crest",
	spritenum: 0,
	itemUser: ["Ambipom"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Ambipom');
	},
	onPrepareHit(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Ambipom') || move.category === 'Status' || move.multihit || move.basePower > 60) return;
		if (move.flags['noparentalbond'] || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
		move.multihit = 2;
		move.multihitType = 'rejuvcrest';
	},
	onBasePowerPriority: 7,
	onBasePower(basePower, pokemon, target, move) {
		if (move.multihitType === 'rejuvcrest' && move.hit > 1 && (pokemon.baseSpecies.baseSpecies === 'Ambipom')) return this.chainModify(0.25);
	},
	num: -3000,
	gen: 9,
}
