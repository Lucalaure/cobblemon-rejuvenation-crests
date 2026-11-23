/*
 * Gothitelle Crest (Pokemon Rejuvenation)
 * Using Dark- and Psychic-type moves swaps between respective types. Recovers HP. SpATK buffed by 1.25x.
 */
{
	name: "Gothitelle Crest",
	spritenum: 0,
	itemUser: ["Gothitelle"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Gothitelle');
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Gothitelle')) return this.chainModify(1.25);
	},
	onModifyMovePriority: 1,
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Gothitelle') || !['Dark', 'Psychic'].includes(move.type)) return;
		if (pokemon.getTypes().join() !== move.type && pokemon.setType(move.type)) {
			this.add('-start', pokemon, 'typechange', move.type, '[from] item: ' + this.effect.name);
		}
	},
	onAfterMoveSecondarySelf(pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Gothitelle') && pokemon.hasType('Dark') && move.totalDamage) this.heal(move.totalDamage / 4, pokemon);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Gothitelle') && pokemon.hasType('Psychic')) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2026,
	gen: 9,
}
