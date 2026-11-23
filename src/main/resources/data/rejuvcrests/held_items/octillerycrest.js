/*
 * Octillery Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Takes less damage from foes that move first. Locks on to attackers, making its ball and bomb moves always crit and hit harder against them.
 */
{
	name: "Octillery Crest",
	spritenum: 0,
	itemUser: ["Octillery"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Octillery');
	},
	onSourceModifyDamage(damage, source, target, move) {
		if ((target.baseSpecies.baseSpecies === 'Octillery') && !target.moveThisTurn) return this.chainModify([2744, 4096]);
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Octillery') || source === target) return;
		if (this.effectState.lockTarget === source && this.effectState.lockUntil >= this.turn) return;
		this.effectState.lockTarget = source;
		this.effectState.lockUntil = this.turn + 1;
		this.add('-activate', target, 'move: Lock-On', '[of] ' + source);
	},
	lockedOn(state, target) {
		return target && state.lockTarget === target && state.lockUntil >= this.turn;
	},
	onModifyMove(move, pokemon, target) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Octillery') || !move.flags['bullet'] || !this.effect.lockedOn.call(this, this.effectState, target)) return;
		move.accuracy = true;
		move.willCrit = true;
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Octillery') || !move.flags['bullet'] || !this.effect.lockedOn.call(this, this.effectState, target)) return;
		return this.chainModify(1 + Math.max(0, 100 - move.basePower) * 0.01);
	},
	num: -3031,
	gen: 9,
}
