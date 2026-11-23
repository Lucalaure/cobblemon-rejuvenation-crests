/*
 * Maractus Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Physical moves use Sp. Atk. Weather and its first move make it Fire type (Sp. Def boost) or Rock type (Defense boost).
 */
{
	name: "Maractus Crest",
	spritenum: 0,
	itemUser: ["Maractus"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Maractus');
	},
	maractusType(battle, pokemon) {
		const first = pokemon.moveSlots[0] && battle.dex.moves.get(pokemon.moveSlots[0].id);
		const weather = pokemon.effectiveWeather();
		const sunny = ['sunnyday', 'desolateland'].includes(weather);
		return ((first && first.category === 'Physical') || sunny) && weather !== 'sandstorm' ? 'Fire' : 'Rock';
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Maractus')) return;
		const types = [pokemon.getTypes()[0], this.effect.maractusType(this, pokemon)];
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	onWeatherChange(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Maractus')) return;
		const types = [pokemon.getTypes()[0], this.effect.maractusType(this, pokemon)];
		if (types.join() !== pokemon.getTypes().join() && pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Maractus') && move.category === 'Physical' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'spa';
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Maractus') && pokemon.moveSlots[0] && pokemon.moveSlots[0].id === move.id && move.category !== 'Status') move.type = this.effect.maractusType(this, pokemon);
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Maractus') && pokemon.hasType('Rock')) return Math.floor(def * (pokemon.storedStats.def + 0.25 * pokemon.storedStats.spa) / pokemon.storedStats.def);
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Maractus') && pokemon.hasType('Fire')) return Math.floor(spd * (pokemon.storedStats.spd + 0.25 * pokemon.storedStats.spa) / pokemon.storedStats.spd);
	},
	num: -3026,
	gen: 9,
}
