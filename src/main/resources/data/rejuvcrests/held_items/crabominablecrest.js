/*
 * Crabominable Crest (Pokemon Rejuvenation)
 * Powers up moves by 50% if holder takes damage before using them. Defense and Sp. Def are also boosted by 25%.
 */
{
	name: "Crabominable Crest",
	spritenum: 0,
	itemUser: ["Crabominable"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Crabominable');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Crabominable')) return this.chainModify(1.25);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Crabominable')) return this.chainModify(1.25);
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Crabominable') && pokemon.hurtThisTurn) return this.chainModify(1.5);
	},
	num: -2012,
	gen: 9,
}
