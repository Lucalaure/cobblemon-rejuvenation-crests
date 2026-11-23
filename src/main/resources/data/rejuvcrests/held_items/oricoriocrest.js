/*
 * Oricorio Crest (Pokemon Rejuvenation)
 * Increases Oricorio's Speed and Sp. Atk stat by 25%.
 */
{
	name: "Oricorio Crest",
	spritenum: 0,
	itemUser: ["Oricorio"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Oricorio');
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Oricorio')) return this.chainModify(1.25);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Oricorio')) return this.chainModify(1.25);
	},
	num: -2040,
	gen: 9,
}
