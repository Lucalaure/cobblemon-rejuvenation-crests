/*
 * Beautifly Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Sp. Atk +20%, Speed +30%. Attacks steal 20% of the foe's Sp. Atk. HP-draining moves are 50% stronger.
 */
{
	name: "Beautifly Crest",
	spritenum: 0,
	itemUser: ["Beautifly"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Beautifly');
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Beautifly')) return this.chainModify(1.2);
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Beautifly')) return this.chainModify(1.3);
	},
	onModifySpAPriority: 2,
	onModifySpA(spa, pokemon) {
		const bonus = (pokemon.baseSpecies.baseSpecies === 'Beautifly') && this.effectState.spaBonus;
		if (bonus) return Math.max(1, Math.floor(spa * (pokemon.storedStats.spa + bonus) / pokemon.storedStats.spa));
	},
	onStart(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Beautifly')) this.effectState.spaBonus = 0;
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Beautifly') || move.category === 'Status' || !target || target === source || target.fainted) return;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.effectState.spaBonus = (this.effectState.spaBonus || 0) + Math.round(0.2 * target.getStat('spa', true, true));
		const Cond = this.dex.conditions.get('confusion').constructor;
		const id = 'rejuvcrestspadrain';
		if (target.volatiles[id]) {
			target.volatiles[id].mult *= 0.8;
		} else {
			target.addVolatile(new Cond({
				name: 'rejuvcrestspadrain',
				noCopy: true,
				onStart(p) { this.effectState.mult = 0.8; this.add('-message', p.name + "'s Sp. Atk was sapped!"); },
				onModifySpAPriority: 3,
				onModifySpA(v, p) { return this.chainModify(this.effectState.mult); },
			}));
		}
	},
	onAllyBasePowerPriority: 22,
	onAllyBasePower(basePower, attacker, defender, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Beautifly') && move.drain) return this.chainModify(1.5);
	},
	num: -3003,
	gen: 9,
}
