/*
 * Reuniclus Crest (Pokemon Rejuvenation)
 * Move changes user to a Physical Fighting or Special Psychic. First move determines initial form. SpATK -> 1.25x.
 */
{
	name: "Reuniclus Crest",
	spritenum: 0,
	itemUser: ["Reuniclus"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Reuniclus');
	},
	/* The crest turns Reuniclus Fighting (with Attack and Sp. Atk swapped) for physical moves, Psychic for special ones. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Reuniclus')) return;
		const first = pokemon.moveSlots[0] && this.dex.moves.get(pokemon.moveSlots[0].id);
		if (first && first.category === 'Physical') {
			this.effectState.physical = true;
			if (pokemon.setType('Fighting')) this.add('-start', pokemon, 'typechange', 'Fighting', '[from] item: ' + this.effect.name);
		}
	},
	onModifyMovePriority: 1,
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Reuniclus') || move.category === 'Status') return;
		const physical = move.category === 'Physical';
		this.effectState.physical = physical;
		const type = physical ? 'Fighting' : 'Psychic';
		if (pokemon.getTypes().join() !== type && pokemon.setType(type)) {
			this.add('-start', pokemon, 'typechange', type, '[from] item: ' + this.effect.name);
		}
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Reuniclus') && this.effectState.physical) return Math.floor(atk * pokemon.storedStats.spa * 1.25 / pokemon.storedStats.atk);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Reuniclus')) return;
		if (this.effectState.physical) return Math.floor(spa * pokemon.storedStats.atk / pokemon.storedStats.spa);
		return this.chainModify(1.25);
	},
	num: -2047,
	gen: 9,
}
