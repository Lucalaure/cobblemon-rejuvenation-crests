/*
 * Vaporeon Crest (Pokemon Rejuvenation)
 * Gains Fire-type STAB. Normal-type moves become Fire-type. Heals 1/16th of its HP each turn.
 */
{
	name: "Vaporeon Crest",
	spritenum: 0,
	itemUser: ["Vaporeon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Vaporeon');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Vaporeon') && move.type === 'Fire') move.forceSTAB = true;
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Vaporeon') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Fire';
			move.typeChangerBoosted = this.effect;
		}
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Vaporeon')) return;
		this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2066,
	gen: 9,
}
