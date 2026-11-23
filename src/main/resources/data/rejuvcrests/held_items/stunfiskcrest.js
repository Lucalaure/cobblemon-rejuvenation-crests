/*
 * Stunfisk Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Gains Water STAB and resistances. Uses Discharge when hit. Paralyzed foes get -1 priority.
 */
{
	name: "Stunfisk Crest",
	spritenum: 0,
	itemUser: ["Stunfisk"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Stunfisk' && !pokemon.baseSpecies.forme));
	},
	onModifyMove(move, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Stunfisk' && !pokemon.baseSpecies.forme)) && move.type === 'Water') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !((target.baseSpecies.baseSpecies === 'Stunfisk' && !target.baseSpecies.forme)) || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Water');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !((target.baseSpecies.baseSpecies === 'Stunfisk' && !target.baseSpecies.forme)) || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Water')) {
			this.add('-immune', target);
			return null;
		}
	},
	onStart(pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Stunfisk' && !pokemon.baseSpecies.forme))) this.effectState.dischargeUsed = false;
	},
	onDamagingHit(damage, target, source, move) {
		if (!((target.baseSpecies.baseSpecies === 'Stunfisk' && !target.baseSpecies.forme)) || source === target || this.effectState.dischargeUsed || target.fainted) return;
		this.effectState.dischargeUsed = true;
		this.add('-activate', target, 'item: ' + this.effect.name);
		this.actions.useMove('discharge', target);
	},
	onFoeModifyPriority(priority, pokemon) {
		if (((this.effectState.target.baseSpecies.baseSpecies === 'Stunfisk' && !this.effectState.target.baseSpecies.forme)) && pokemon.status === 'par') return priority - 1;
	},
	num: -3039,
	gen: 9,
}
