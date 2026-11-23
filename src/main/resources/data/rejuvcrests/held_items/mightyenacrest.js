/*
 * Mightyena Crest (Pokemon Rejuvenation)
 * Biting moves given 50% boost in power. Speed increased by 20%.
 */
{
	name: "Mightyena Crest",
	spritenum: 0,
	itemUser: ["Mightyena"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Mightyena');
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Mightyena')) return this.chainModify(1.2);
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Mightyena') && move.flags['bite']) return this.chainModify(1.5);
	},
	num: -2038,
	gen: 9,
}
