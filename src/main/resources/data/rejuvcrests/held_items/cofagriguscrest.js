/*
 * Cofagrigus Crest (Pokemon Rejuvenation)
 * Increases Cofagrigus's Defense by 40% and Sp. Atk by 20%.
 */
{
	name: "Cofagrigus Crest",
	spritenum: 0,
	itemUser: ["Cofagrigus"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Cofagrigus');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cofagrigus')) return this.chainModify(1.4);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cofagrigus')) return this.chainModify(1.2);
	},
	num: -2009,
	gen: 9,
}
