/*
 * Simisear Crest (Pokemon Rejuvenation)
 * Gains Water-type STAB and resistances. Normal-type moves become Water-type. Attack and Sp. Atk are boosted by 20%.
 */
{
	name: "Simisear Crest",
	spritenum: 0,
	itemUser: ["Simisear"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Simisear');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisear')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisear')) return this.chainModify(1.2);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisear') && move.type === 'Water') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Simisear') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Water');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Simisear') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Water')) {
			this.add('-immune', target);
			return null;
		}
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Simisear') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Water';
			move.typeChangerBoosted = this.effect;
		}
	},
	num: -2058,
	gen: 9,
}
