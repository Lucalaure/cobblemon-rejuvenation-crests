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
	/* Male (Rejuvenation): its own moves act as if the sun is out, and it heals 10% HP every turn. */
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora') || pokemon.gender === 'F' || ['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return;
		if (move.type === 'Fire') return this.chainModify(1.5);
		if (move.type === 'Water') return this.chainModify(0.5);
	},
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Sunflora') && pokemon.gender !== 'F' && pokemon.hasAbility('chlorophyll') && !['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(2);
	},
	onChargeMove(pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora') || pokemon.gender === 'F' || !['solarbeam', 'solarblade'].includes(move.id)) return;
		this.attrLastMove('[still]');
		this.addMove('-anim', pokemon, move.name, target);
		return false;
	},
	/* Female (Crest Emporium): sun that lasts while Sunflora is out, Fire resistances and immunity to Fire moves. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora') || pokemon.gender !== 'F' || this.field.isWeather(['sunnyday', 'desolateland'])) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.field.setWeather('sunnyday', pokemon);
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Sunflora') || target.gender !== 'F' || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Fire');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Sunflora') || target.gender !== 'F' || move.type !== 'Fire' || move.category === 'Status') return;
		this.add('-immune', target, '[from] item: ' + this.effect.name);
		return null;
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sunflora')) return;
		if (pokemon.gender !== 'F') {
			this.heal(pokemon.baseMaxhp / 10);
		} else if (this.field.isWeather('sunnyday') && this.field.weatherState.duration) {
			this.field.weatherState.duration += 1;
		}
	},
	num: -2061,
	gen: 9,
}
