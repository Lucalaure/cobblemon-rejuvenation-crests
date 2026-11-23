/*
 * Magcargo Crest (Pokemon Rejuvenation)
 * Magcargo's Defense and Speed are swapped, and Sp. Atk increases by 20%.
 */
{
	name: "Magcargo Crest",
	spritenum: 0,
	itemUser: ["Magcargo"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Magcargo');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Magcargo')) return Math.floor(def * pokemon.storedStats.spe / pokemon.storedStats.def);
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Magcargo')) return Math.floor(spe * pokemon.storedStats.def / pokemon.storedStats.spe);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Magcargo')) return this.chainModify(1.2);
	},
	num: -2036,
	gen: 9,
}
