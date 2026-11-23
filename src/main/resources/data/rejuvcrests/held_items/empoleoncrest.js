/*
 * Empoleon Crest (Pokemon Rejuvenation)
 * Empoleon's Ice-type moves are boosted by 50%, and Speed is doubled in Hail, Snow and on Ice Fields.
 */
{
	name: "Empoleon Crest",
	spritenum: 0,
	itemUser: ["Empoleon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Empoleon');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Empoleon') && move.type === 'Ice') move.forceSTAB = true;
	},
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Empoleon') && this.field.isWeather(['hail', 'snowscape', 'snow'])) return this.chainModify(2);
	},
	onImmunity(type, pokemon) {
		if (type === 'hail' && (pokemon.baseSpecies.baseSpecies === 'Empoleon')) return false;
	},
	num: -2020,
	gen: 9,
}
