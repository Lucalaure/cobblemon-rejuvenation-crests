/*
 * Relicanth Crest (Pokemon Rejuvenation)
 * Increases Relicanth's Attack by 25% and Sp. Def by 35%.
 */
{
	name: "Relicanth Crest",
	spritenum: 0,
	itemUser: ["Relicanth"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Relicanth');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Relicanth')) return this.chainModify(1.25);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Relicanth')) return this.chainModify(1.35);
	},
	num: -2046,
	gen: 9,
}
