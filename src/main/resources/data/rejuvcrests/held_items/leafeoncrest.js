/*
 * Leafeon Crest (Pokemon Rejuvenation)
 * Leafeon takes resisted damage from Fire and Flying attacks. Abilities apply regardless of if their weather is active.
 */
{
	name: "Leafeon Crest",
	spritenum: 0,
	itemUser: ["Leafeon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Leafeon');
	},
	onEffectiveness(typeMod, target, type, move) {
		if (target && (target.baseSpecies.baseSpecies === 'Leafeon') && ['Fire', 'Flying'].includes(move.type) && type === target.getTypes()[0]) return -1;
	},
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Leafeon') && pokemon.hasAbility('chlorophyll') && !['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(2);
	},
	onSetStatus(status, target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Leafeon') || !target.hasAbility('leafguard') || ['sunnyday', 'desolateland'].includes(target.effectiveWeather())) return;
		if (effect?.status) this.add('-immune', target, '[from] ability: Leaf Guard');
		return false;
	},
	onTryAddVolatile(status, target) {
		if (status.id === 'yawn' && (target.baseSpecies.baseSpecies === 'Leafeon') && target.hasAbility('leafguard')) {
			this.add('-immune', target, '[from] ability: Leaf Guard');
			return null;
		}
	},
	num: -2030,
	gen: 9,
}
