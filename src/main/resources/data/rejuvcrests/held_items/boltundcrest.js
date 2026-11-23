/*
 * Boltund Crest (Pokemon Rejuvenation)
 * Gain a 1.5x boost to biting moves if Boltund moves before target.
 */
{
	name: "Boltund Crest",
	spritenum: 0,
	itemUser: ["Boltund"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Boltund');
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Boltund') && move.flags['bite'] && target && !target.moveThisTurn) return this.chainModify(1.5);
	},
	num: -2005,
	gen: 9,
}
