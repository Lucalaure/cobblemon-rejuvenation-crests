/*
 * Smeargle Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Smeargle's types and stats are shaped by its moveset.
 */
{
	name: "Smeargle Crest",
	spritenum: 0,
	itemUser: ["Smeargle"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Smeargle');
	},
	/* Port of Crest Emporium's Smeargle formula: types from its first two moves, stats from its whole moveset. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Smeargle')) return;
		const special = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dragon', 'Dark'];
		const allTypes = this.dex.types.names().filter(t => t !== 'Stellar');
		const moves = pokemon.moveSlots.map(s => this.dex.moves.get(s.id));
		while (moves.length < 4) moves.push(moves[0]);
		const type1 = moves[0].type;
		let type2 = moves[1].type !== type1 ? moves[1].type : null;
		let same = 0.02;
		if (moves[1].category === 'Status' || moves[1].type === type1) same *= (moves[1].category === 'Status' && moves[1].type === type1) ? 4 : 2;
		if (moves[2].type === type1 || moves[2].type === type2) same *= 1.5;
		if (moves[3].type === type1 || moves[3].type === type2) same *= 1.5;
		let offRes = 1, offWeak = 1, defRes = 1, defWeak = 1, atk = 1, def = 1, spa = 1, spd = 1, spe = 1;
		for (const m of moves) {
			for (const t of allTypes) {
				const immune = !this.dex.getImmunity(m.type, t);
				const eff = this.dex.getEffectiveness(m.type, t);
				if (immune || eff < 0) offRes += 0.01;
				if (!immune && eff > 0) offWeak += 0.01;
				const immuneTo = !this.dex.getImmunity(t, m.type);
				const effOn = this.dex.getEffectiveness(t, m.type);
				if (immuneTo || effOn < 0) defRes += 0.01;
				if (!immuneTo && effOn > 0) defWeak += 0.01;
			}
			if (m.category === 'Physical') atk += 0.4775;
			if (m.category === 'Special') spa += 0.4775;
			if (!special.includes(m.type)) def += 0.089; else spd += 0.089;
			if (m.category !== 'Status') spe += 0.05;
			if (m.category === 'Status') {
				const single = m.target === 'normal';
				if (!special.includes(m.type)) def *= single ? 0.75 : 1.05; else spd *= single ? 0.75 : 1.05;
				spe *= single ? 0.835 : 0.98;
			}
		}
		this.effectState.mults = {
			atk: (offRes - offWeak) + atk + same,
			def: ((defWeak - defRes) + def + same) * 1.05,
			spa: (offRes - offWeak) + spa + same,
			spd: (defWeak - defRes) + spd + same,
			spe: same + spe,
		};
		const types = type2 ? [type1, type2] : [type1];
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	onModifyAtkPriority: 2,
	onModifyAtk(v, pokemon) {
		const m = (pokemon.baseSpecies.baseSpecies === 'Smeargle') && this.effectState.mults;
		if (m) return this.chainModify(Math.max(0.1, m.atk));
	},
	onModifyDefPriority: 2,
	onModifyDef(v, pokemon) {
		const m = (pokemon.baseSpecies.baseSpecies === 'Smeargle') && this.effectState.mults;
		if (m) return this.chainModify(Math.max(0.1, m.def));
	},
	onModifySpAPriority: 2,
	onModifySpA(v, pokemon) {
		const m = (pokemon.baseSpecies.baseSpecies === 'Smeargle') && this.effectState.mults;
		if (m) return this.chainModify(Math.max(0.1, m.spa));
	},
	onModifySpDPriority: 2,
	onModifySpD(v, pokemon) {
		const m = (pokemon.baseSpecies.baseSpecies === 'Smeargle') && this.effectState.mults;
		if (m) return this.chainModify(Math.max(0.1, m.spd));
	},
	onModifySpePriority: 2,
	onModifySpe(v, pokemon) {
		const m = (pokemon.baseSpecies.baseSpecies === 'Smeargle') && this.effectState.mults;
		if (m) return this.chainModify(Math.max(0.1, m.spe));
	},
	num: -3038,
	gen: 9,
}
