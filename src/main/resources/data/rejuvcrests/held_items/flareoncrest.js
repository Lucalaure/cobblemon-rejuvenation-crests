/*
 * Flareon Crest (Pokemon Rejuvenation)
 * Gains Electric-type STAB. Normal-type moves become Electric-type. Speed boosted by 40%.
 */
{
	name: "Flareon Crest",
	spritenum: 0,
	itemUser: ["Flareon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Flareon');
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Flareon')) return this.chainModify(1.4);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Flareon') && move.type === 'Electric') move.forceSTAB = true;
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Flareon') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Electric';
			move.typeChangerBoosted = this.effect;
		}
	},
	num: -2022,
	gen: 9,
}
