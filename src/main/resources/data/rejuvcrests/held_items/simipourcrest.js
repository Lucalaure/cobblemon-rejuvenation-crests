/*
 * Simipour Crest (Pokemon Rejuvenation)
 * Gains Grass-type STAB and resistances. Normal-type moves become Grass-type. Attack and Sp. Atk are boosted by 20%.
 */
{
	name: "Simipour Crest",
	spritenum: 0,
	itemUser: ["Simipour"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Simipour');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simipour')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simipour')) return this.chainModify(1.2);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simipour') && move.type === 'Grass') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Simipour') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Grass');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Simipour') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Grass')) {
			this.add('-immune', target);
			return null;
		}
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Simipour') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Grass';
			move.typeChangerBoosted = this.effect;
		}
	},
	num: -2054,
	gen: 9,
}
