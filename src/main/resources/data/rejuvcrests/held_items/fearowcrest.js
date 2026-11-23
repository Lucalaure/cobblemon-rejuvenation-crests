/*
 * Fearow Crest (Pokemon Rejuvenation)
 * Increases the power of stabbing moves by 50%. Increase critical-hit ratio by 1.
 */
{
	name: "Fearow Crest",
	spritenum: 0,
	itemUser: ["Fearow"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Fearow');
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Fearow') && ['hornattack', 'furyattack', 'poisonsting', 'twineedle', 'pinmissile', 'peck', 'drillpeck', 'megahorn', 'poisonjab', 'needlearm', 'pluck', 'drillrun', 'hornleech', 'fellstinger', 'smartstrike', 'branchpoke', 'falsesurrender', 'glaciallance'].includes(move.id)) return this.chainModify(1.5);
	},
	onModifyCritRatio(critRatio, source) {
		if ((source.baseSpecies.baseSpecies === 'Fearow')) return critRatio + 1;
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Fearow') && move.id === 'furyattack') move.multihit = 5;
	},
	num: -2022,
	gen: 9,
}
