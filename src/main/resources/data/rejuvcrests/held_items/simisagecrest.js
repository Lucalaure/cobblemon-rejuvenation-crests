/*
 * Simisage Crest (Pokemon Rejuvenation)
 * Gains Fire-type STAB and resistances. Normal-type moves become Fire-type. Attack and Sp. Atk are boosted by 20%.
 */
{
	name: "Simisage Crest",
	spritenum: 0,
	itemUser: ["Simisage"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Simisage');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisage')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisage')) return this.chainModify(1.2);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Simisage') && move.type === 'Fire') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Simisage') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Fire');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Simisage') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Fire')) {
			this.add('-immune', target);
			return null;
		}
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		const noModifyType = ['judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball'];
		if ((pokemon.baseSpecies.baseSpecies === 'Simisage') && move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
			move.type = 'Fire';
			move.typeChangerBoosted = this.effect;
		}
	},
	num: -2055,
	gen: 9,
}
