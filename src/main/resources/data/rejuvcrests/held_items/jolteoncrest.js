/*
 * Jolteon Crest (Pokemon Rejuvenation)
 * Gains Water-type STAB. Normal-type moves become Water-type. Attack scales with Special Attack.
 */
{
	name: "Jolteon Crest",
	spritenum: 0,
	itemUser: ["Jolteon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Jolteon');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Jolteon')) return Math.floor(atk * pokemon.storedStats.spa / pokemon.storedStats.atk);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Jolteon') && move.type === 'Water') move.forceSTAB = true;
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Jolteon') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Water';
			move.typeChangerBoosted = this.effect;
		}
	},
	num: -2029,
	gen: 9,
}
