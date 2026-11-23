/*
 * Castform Crest (Pokemon Rejuvenation)
 * Castform uses the first weather move it knows. Its Forecast forms also become empowered.
 */
{
	name: "Castform Crest",
	spritenum: 0,
	itemUser: ["Castform"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Castform');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Castform')) return;
		const weathers = {sunnyday: 'sunnyday', raindance: 'raindance', sandstorm: 'sandstorm', hail: 'hail', snowscape: 'snowscape'};
		const slot = pokemon.moveSlots.find(s => weathers[s.id]);
		if (!slot) return;
		let weather = weathers[slot.id];
		if (weather === 'hail' && !this.dex.conditions.get('hail').exists) weather = 'snowscape';
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.field.setWeather(weather, pokemon);
	},
	/* Empowered Forecast forms: Sunny = Solar Power, Rainy = Rain Dish, Snowy = Slush Rush + hail immunity. */
	onModifySpAPriority: 5,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Castform') && ['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(1.5);
	},
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Castform') && this.field.isWeather(['hail', 'snowscape', 'snow'])) return this.chainModify(2);
	},
	onImmunity(type, pokemon) {
		if (type === 'hail' && (pokemon.baseSpecies.baseSpecies === 'Castform')) return false;
	},
	onWeather(target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Castform') || target.hasItem('utilityumbrella')) return;
		if (effect.id === 'sunnyday' || effect.id === 'desolateland') this.damage(target.baseMaxhp / 8, target, target);
		else if (effect.id === 'raindance' || effect.id === 'primordialsea') this.heal(target.baseMaxhp / 16);
	},
	num: -2006,
	gen: 9,
}
