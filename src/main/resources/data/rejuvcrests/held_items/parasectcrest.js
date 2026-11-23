/*
 * Parasect Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Blocks the first Fire-type attack after switching in, hurting the attacker. Damaging moves have a 30% chance to poison, burn or paralyze, and drain 20% of a statused foe's Attack.
 */
{
	name: "Parasect Crest",
	spritenum: 0,
	itemUser: ["Parasect"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Parasect');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Parasect')) return;
		this.effectState.sporesUsed = false;
		this.effectState.atkBonus = 0;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Parasect') || move.type !== 'Fire' || move.category === 'Status' || this.effectState.sporesUsed) return;
		this.effectState.sporesUsed = true;
		this.add('-activate', target, 'item: ' + this.effect.name);
		this.add('-message', target.name + "'s spores exploded!");
		const eff = Math.pow(2, source.runEffectiveness(move));
		if (source.runImmunity('Fire')) this.damage(source.baseMaxhp * eff / 4, source, target);
		return null;
	},
	onModifyAtkPriority: 2,
	onModifyAtk(atk, pokemon) {
		const bonus = (pokemon.baseSpecies.baseSpecies === 'Parasect') && this.effectState.atkBonus;
		if (bonus) return Math.max(1, Math.floor(atk * (pokemon.storedStats.atk + bonus) / pokemon.storedStats.atk));
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Parasect') || move.category === 'Status' || !target || target === source) return;
		if (target.status && !target.fainted) {
			this.add('-activate', source, 'item: ' + this.effect.name);
			this.effectState.atkBonus = (this.effectState.atkBonus || 0) + Math.round(0.2 * target.getStat('atk', true, true));
		const Cond = this.dex.conditions.get('confusion').constructor;
		const id = 'rejuvcrestatkdrain';
		if (target.volatiles[id]) {
			target.volatiles[id].mult *= 0.8;
		} else {
			target.addVolatile(new Cond({
				name: 'rejuvcrestatkdrain',
				noCopy: true,
				onStart(p) { this.effectState.mult = 0.8; this.add('-message', p.name + "'s Attack was sapped!"); },
				onModifyAtkPriority: 3,
				onModifyAtk(v, p) { return this.chainModify(this.effectState.mult); },
			}));
		}
		}
		if (target && !target.fainted && target !== source && this.randomChance(3, 10)) {
			const status = this.sample(['psn', 'brn', 'par']);
			target.trySetStatus(status, source, this.effect);
		}
	},
	num: -3033,
	gen: 9,
}
