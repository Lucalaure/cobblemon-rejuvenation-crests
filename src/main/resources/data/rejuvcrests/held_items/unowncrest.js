/*
 * Unown Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Hidden Power hits once for every party member, using their Hidden Power types. Resists its party's Hidden Power types. Attack boosts its other stats.
 */
{
	name: "Unown Crest",
	spritenum: 0,
	itemUser: ["Unown"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Unown');
	},
	partyTypes(pokemon) {
		return pokemon.side.pokemon.slice(0, 6).map(p => p.hpType || 'Dark');
	},
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Unown') || !move.id.startsWith('hiddenpower')) return;
		move.multihit = this.effect.partyTypes(pokemon).length;
		move.multihitType = 'rejuvcrest';
	},
	onBasePowerPriority: 40,
	onBasePower(basePower, pokemon, target, move) {
		/* Each hit uses the next party member's Hidden Power type. */
		if (!(pokemon.baseSpecies.baseSpecies === 'Unown') || move.multihitType !== 'rejuvcrest' || !move.id.startsWith('hiddenpower')) return;
		const types = this.effect.partyTypes(pokemon);
		move.type = types[(move.hit - 1) % types.length];
	},
	onSourceModifyDamage(damage, source, target, move) {
		if (!(target.baseSpecies.baseSpecies === 'Unown')) return;
		let factor = 0;
		for (const t of this.effect.partyTypes(target)) {
			if (t === move.type) factor += 2;
			else if (!this.dex.getImmunity(move.type, t) || this.dex.getEffectiveness(move.type, t) < 0) factor += 1.33;
		}
		if (factor) return this.chainModify(1 / factor);
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Unown')) return Math.floor(def * (pokemon.storedStats.def + 0.33 * pokemon.storedStats.atk) / pokemon.storedStats.def);
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Unown')) return Math.floor(spd * (pokemon.storedStats.spd + 0.33 * pokemon.storedStats.atk) / pokemon.storedStats.spd);
	},
	onModifySpePriority: 2,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Unown')) return Math.floor(spe * (pokemon.storedStats.spe + 0.33 * pokemon.storedStats.atk) / pokemon.storedStats.spe);
	},
	num: -3043,
	gen: 9,
}
