/*
 * Avalugg Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Starts hail on entry. Each turn in hail or snow, Sp. Def gains 10% of its Defense.
 */
{
	name: "Avalugg Crest",
	spritenum: 0,
	itemUser: ["Avalugg"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Avalugg' && !pokemon.baseSpecies.forme));
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		const bonus = ((pokemon.baseSpecies.baseSpecies === 'Avalugg' && !pokemon.baseSpecies.forme)) && this.effectState.spdBonus;
		if (bonus) return Math.max(1, Math.floor(spd * (pokemon.storedStats.spd + bonus) / pokemon.storedStats.spd));
	},
	onStart(pokemon) {
		if (!((pokemon.baseSpecies.baseSpecies === 'Avalugg' && !pokemon.baseSpecies.forme))) return;
		this.effectState.spdBonus = 0;
		if (this.field.isWeather(['hail', 'snowscape', 'snow'])) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.field.setWeather(this.dex.conditions.get('hail').exists ? 'hail' : 'snowscape', pokemon);
	},
	onResidualOrder: 5,
	onResidual(pokemon) {
		if (!((pokemon.baseSpecies.baseSpecies === 'Avalugg' && !pokemon.baseSpecies.forme)) || !this.field.isWeather(['hail', 'snowscape', 'snow'])) return;
		this.effectState.spdBonus = (this.effectState.spdBonus || 0) + Math.floor(pokemon.storedStats.def * 0.1);
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.add('-message', pokemon.name + "'s crest raised its Special Defense!");
	},
	num: -3002,
	gen: 9,
}
