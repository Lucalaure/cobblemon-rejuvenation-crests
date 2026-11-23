/*
 * Sunflora Crest (Pokemon Rejuvenation)
 * An item to be held by Sunflora. User behaves as if Sun is active and heals 10% HP every turn.
 */
{
	name: "Sunflora Crest",
	spritenum: 0,
	itemUser: ["Sunflora"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Sunflora');
	},
	/* Sunflora's own moves act as if the sun is out, and it heals 10% HP every turn. */
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora') || ['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return;
		if (move.type === 'Fire') return this.chainModify(1.5);
		if (move.type === 'Water') return this.chainModify(0.5);
	},
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Sunflora') && pokemon.hasAbility('chlorophyll') && !['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(2);
	},
	onChargeMove(pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora') || !['solarbeam', 'solarblade'].includes(move.id)) return;
		this.attrLastMove('[still]');
		this.addMove('-anim', pokemon, move.name, target);
		return false;
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora')) return;
		this.heal(pokemon.baseMaxhp / 10);
	},
	num: -2063,
	gen: 9,
}
