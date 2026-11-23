/*
 * Druddigon Crest (Pokemon Rejuvenation)
 * Heals in the sun and from Fire-type moves. Fire- and Dragon-type moves get boosted by 30%.
 */
{
	name: "Druddigon Crest",
	spritenum: 0,
	itemUser: ["Druddigon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Druddigon');
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target !== source && (target.baseSpecies.baseSpecies === 'Druddigon') && move.type === 'Fire') {
			if (!this.heal(target.baseMaxhp / 4)) this.add('-immune', target, '[from] item: ' + this.effect.name);
			return null;
		}
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Druddigon') && (move.type === 'Fire' || move.type === 'Dragon')) return this.chainModify(1.3);
	},
	onWeather(target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Druddigon') && (effect.id === 'sunnyday' || effect.id === 'desolateland') && !target.hasItem('utilityumbrella')) this.heal(target.baseMaxhp / 16);
	},
	num: -2015,
	gen: 9,
}
