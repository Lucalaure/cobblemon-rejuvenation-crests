/*
 * Dusknoir Crest (Pokemon Rejuvenation)
 * Increases Dusknoir's Attack by 50% and boosts weaker moves.
 */
{
	name: "Dusknoir Crest",
	spritenum: 0,
	itemUser: ["Dusknoir"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Dusknoir');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dusknoir')) return this.chainModify(1.5);
	},
	onBasePowerPriority: 30,
	onBasePower(basePower, attacker, defender, move) {
		if ((attacker.baseSpecies.baseSpecies === 'Dusknoir') && move.basePower > 0 && move.basePower <= 60) return this.chainModify(1.5);
	},
	num: -2018,
	gen: 9,
}
