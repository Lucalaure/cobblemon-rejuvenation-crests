/*
 * Plusle Crest (Pokemon Rejuvenation)
 * Activates Plus. Raises the power of physical moves of the user and its partner by 33%.
 */
{
	name: "Plusle Crest",
	spritenum: 0,
	itemUser: ["Plusle"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Plusle');
	},
	onModifySpAPriority: 5,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Plusle') && pokemon.hasAbility(['plus', 'minus'])) return this.chainModify(1.5);
	},
	onAllyBasePowerPriority: 22,
	onAllyBasePower(basePower, attacker, defender, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Plusle') && move.category === 'Physical') return this.chainModify([5461, 4096]);
	},
	num: -2044,
	gen: 9,
}
