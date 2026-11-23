/*
 * Glaceon Crest (Pokemon Rejuvenation)
 * Glaceon takes resisted damage from Rock and Fighting attacks. Abilities apply regardless of the weather.
 */
{
	name: "Glaceon Crest",
	spritenum: 0,
	itemUser: ["Glaceon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Glaceon');
	},
	onEffectiveness(typeMod, target, type, move) {
		if (target && (target.baseSpecies.baseSpecies === 'Glaceon') && ['Fighting', 'Rock'].includes(move.type) && type === target.getTypes()[0]) return -1;
	},
	onModifyAccuracyPriority: -1,
	onModifyAccuracy(accuracy, target) {
		if (typeof accuracy !== 'number' || !(target.baseSpecies.baseSpecies === 'Glaceon') || !target.hasAbility('snowcloak')) return;
		if (!this.field.isWeather(['hail', 'snowscape', 'snow'])) return this.chainModify([3277, 4096]);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Glaceon') && pokemon.hasAbility('icebody') && !this.field.isWeather(['hail', 'snowscape', 'snow'])) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2027,
	gen: 9,
}
