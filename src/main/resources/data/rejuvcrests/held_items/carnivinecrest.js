/*
 * Carnivine Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Traps foes it hits or that hit it in a Snap Trap, weakening their attacks and sapping their HP.
 */
{
	name: "Carnivine Crest",
	spritenum: 0,
	itemUser: ["Carnivine"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Carnivine');
	},
	snapTrap(battle, holder, foe) {
		if (!foe || foe.fainted || foe === holder || foe.isAlly(holder) || foe.volatiles['rejuvcrestsnaptrap']) return;
		const Cond = battle.dex.conditions.get('confusion').constructor;
		battle.add('-activate', holder, 'item: Carnivine Crest');
		foe.addVolatile(new Cond({
			name: 'rejuvcrestsnaptrap',
			noCopy: true,
			duration: 5,
			onStart(p) { this.effectState.turns = 0; this.add('-message', p.name + ' was caught in a snap trap!'); },
			onTrapPokemon(p) { p.tryTrap(); },
			onModifyDamage(damage, source) { return this.chainModify(0.8 * (0.9 - this.effectState.turns * 0.01)); },
			onResidualOrder: 13,
			onResidual(p) {
				const src = this.effectState.source;
				if (!src || !src.isActive || src.hp <= 0) { p.removeVolatile('rejuvcrestsnaptrap'); return; }
				this.effectState.turns++;
				this.damage(p.baseMaxhp / 8, p, src);
				this.heal(p.baseMaxhp / Math.floor(8 * (1 + 0.05 * this.effectState.turns)), src, src);
			},
			onEnd(p) { this.add('-message', p.name + ' was freed from the snap trap.'); },
		}), holder);
	},
	onDamagingHit(damage, target, source, move) {
		if ((target.baseSpecies.baseSpecies === 'Carnivine')) this.effect.snapTrap(this, target, source);
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Carnivine') && move.category !== 'Status') this.effect.snapTrap(this, source, target);
	},
	num: -3006,
	gen: 9,
}
