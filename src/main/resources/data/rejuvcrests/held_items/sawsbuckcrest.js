/*
 * Sawsbuck Crest (Pokemon Rejuvenation)
 * Replaces Normal-type with a Seasonal type. Normal-type moves become the Seasonal type and are boosted by 20%.
 */
{
	name: "Sawsbuck Crest",
	spritenum: 0,
	itemUser: ["Sawsbuck"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Sawsbuck');
	},
	/* Spring = Water, Summer = Fire, Autumn = Ground, Winter = Ice. Replaces Sawsbuck's Normal type. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sawsbuck')) return;
		const type = this.effect.seasonType(pokemon);
		const types = pokemon.getTypes().map(t => t === 'Normal' ? type : t);
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	seasonType(pokemon) {
		const forme = (pokemon.baseSpecies.forme || '').toLowerCase();
		const aspects = String(pokemon.set && (pokemon.set.aspects || pokemon.set.name) || '').toLowerCase();
		const key = forme || aspects;
		if (key.includes('summer')) return 'Fire';
		if (key.includes('autumn')) return 'Ground';
		if (key.includes('winter')) return 'Ice';
		return 'Water';
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Sawsbuck') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = this.effect.seasonType(pokemon);
			move.typeChangerBoosted = this.effect;
		}
	},
	onBasePowerPriority: 23,
	onBasePower(basePower, pokemon, target, move) {
		if (move.typeChangerBoosted === this.effect) return this.chainModify(1.2);
	},
	num: -2052,
	gen: 9,
}
