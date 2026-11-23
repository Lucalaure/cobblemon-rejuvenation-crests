/*
 * Feraligatr Crest (Pokemon Rejuvenation)
 * First move has increased priority if it's damaging. Biting moves deal 50% more damage.
 */
{
	name: "Feraligatr Crest",
	spritenum: 0,
	itemUser: ["Feraligatr"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Feraligatr');
	},
	onModifyPriority(priority, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Feraligatr') && move.category !== 'Status' && pokemon.activeMoveActions === 0) return priority + 1;
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Feraligatr') && move.flags['bite']) return this.chainModify(1.5);
	},
	num: -2021,
	gen: 9,
}
