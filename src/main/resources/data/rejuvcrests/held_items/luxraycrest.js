/*
 * Luxray Crest (Pokemon Rejuvenation)
 * Gains Dark-type STAB and resistances. Normal-type moves become Electric-type moves and deal 20% more damage.
 */
{
	name: "Luxray Crest",
	spritenum: 0,
	itemUser: ["Luxray"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Luxray');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Luxray') && move.type === 'Dark') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Luxray') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Dark');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Luxray') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Dark')) {
			this.add('-immune', target);
			return null;
		}
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Luxray') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Electric';
			move.typeChangerBoosted = this.effect;
		}
	},
	onBasePowerPriority: 23,
	onBasePower(basePower, pokemon, target, move) {
		if (move.typeChangerBoosted === this.effect) return this.chainModify(1.2);
	},
	num: -2035,
	gen: 9,
}
