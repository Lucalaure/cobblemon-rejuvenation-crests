/*
 * Hypno Crest (Pokemon Rejuvenation)
 * Increases Hypno's Special Attack and Accuracy by 50%.
 */
{
	name: "Hypno Crest",
	spritenum: 0,
	itemUser: ["Hypno"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Hypno');
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Hypno')) return this.chainModify(1.5);
	},
	onSourceModifyAccuracyPriority: -1,
	onSourceModifyAccuracy(accuracy, target, source) {
		if (typeof accuracy === 'number' && (source.baseSpecies.baseSpecies === 'Hypno')) return this.chainModify(1.5);
	},
	num: -2027,
	gen: 9,
}
