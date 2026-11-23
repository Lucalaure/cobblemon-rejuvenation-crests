/*
 * Stantler Crest (Pokemon Rejuvenation)
 * Increases Stantler's and Wyrdeer's Attack and Accuracy by 50%.
 */
{
	name: "Stantler Crest",
	spritenum: 0,
	itemUser: ["Stantler", "Wyrdeer"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Stantler' || pokemon.baseSpecies.baseSpecies === 'Wyrdeer');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Stantler' || pokemon.baseSpecies.baseSpecies === 'Wyrdeer')) return this.chainModify(1.5);
	},
	onSourceModifyAccuracyPriority: -1,
	onSourceModifyAccuracy(accuracy, target, source) {
		if (typeof accuracy === 'number' && (source.baseSpecies.baseSpecies === 'Stantler' || source.baseSpecies.baseSpecies === 'Wyrdeer')) return this.chainModify(1.5);
	},
	num: -2061,
	gen: 9,
}
