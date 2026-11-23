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
	/* Male (Rejuvenation): Spring = Water, Summer = Fire, Autumn = Ground, Winter = Ice; Normal moves take that type, +20%. */
	/* Female (Crest Emporium): Spring = Fairy, Summer = Fire, Autumn = Ghost, Winter = Ice; its first move takes that type */
	/* and gains a seasonal side effect. */
	season(pokemon) {
		const forme = (pokemon.baseSpecies.forme || '').toLowerCase();
		if (forme.includes('summer')) return 'summer';
		if (forme.includes('autumn')) return 'autumn';
		if (forme.includes('winter')) return 'winter';
		return 'spring';
	},
	seasonType(pokemon) {
		const female = pokemon.gender === 'F';
		return {spring: female ? 'Fairy' : 'Water', summer: 'Fire', autumn: female ? 'Ghost' : 'Ground', winter: 'Ice'}[this.season(pokemon)];
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sawsbuck')) return;
		const type = this.effect.seasonType(pokemon);
		const types = pokemon.getTypes().map(t => t === 'Normal' ? type : t);
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sawsbuck') || (move.isZ && move.category !== 'Status')) return;
		if (pokemon.gender === 'F') {
			if (pokemon.moveSlots[0] && pokemon.moveSlots[0].id === move.id && move.category !== 'Status') move.type = this.effect.seasonType(pokemon);
			return;
		}
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if (move.type === 'Normal' && !noModifyType.includes(move.id)) {
			move.type = this.effect.seasonType(pokemon);
			move.typeChangerBoosted = this.effect;
		}
	},
	onBasePowerPriority: 23,
	onBasePower(basePower, pokemon, target, move) {
		if (move.typeChangerBoosted === this.effect) return this.chainModify(1.2);
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Sawsbuck') || source.gender !== 'F' || move.category === 'Status' || !source.moveSlots[0] || source.moveSlots[0].id !== move.id) return;
		const season = this.effect.season(source);
		const chance = (season === 'summer' || season === 'winter' ? 1 : 3) * (source.hasAbility('serenegrace') ? 2 : 1);
		if (!this.randomChance(chance, 10)) return;
		if (season === 'spring') { this.boost({atk: 1}, source, source); return; }
		if (!target || target.fainted) return;
		if (season === 'summer') target.trySetStatus('brn', source, this.effect);
		if (season === 'autumn') this.boost({spe: -1}, target, source);
		if (season === 'winter') target.trySetStatus('slp', source, this.effect);
	},
	num: -2050,
	gen: 9,
}
