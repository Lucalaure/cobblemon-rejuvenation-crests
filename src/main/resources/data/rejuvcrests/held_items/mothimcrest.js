/*
 * Mothim Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Speed and its higher offense +30%. Attacks hit the weaker defense. Secret Power calls a follow-up move depending on its move slot.
 */
{
	name: "Mothim Crest",
	spritenum: 0,
	itemUser: ["Mothim"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Mothim');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Mothim')) return;
		const s = pokemon.storedStats;
		if (s.atk === s.spa) return this.chainModify(1.15);
		if (s.atk > s.spa) return this.chainModify(1.3);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Mothim')) return;
		const s = pokemon.storedStats;
		if (s.atk === s.spa) return this.chainModify(1.15);
		if (s.spa > s.atk) return this.chainModify(1.3);
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Mothim')) return this.chainModify(1.3);
	},
	onModifyMove(move, pokemon, target) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Mothim') || move.category === 'Status' || !target || move.overrideDefensiveStat) return;
		move.overrideDefensiveStat = target.getStat('def') <= target.getStat('spd') ? 'def' : 'spd';
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Mothim') || move.id !== 'secretpower' || move.rejuvFollowUp || !target || target.fainted) return;
		const slot = Math.max(0, source.moveSlots.findIndex(s => s.id === 'secretpower'));
		const special = source.getStat('spa') >= source.getStat('atk');
		const follow = [special ? 'leaftornado' : 'razorleaf', special ? 'mudshot' : 'bulldoze', special ? 'mirrorshot' : 'steelwing', special ? 'aircutter' : 'pluck'][slot];
		const m = this.dex.getActiveMove(follow);
		m.rejuvFollowUp = true;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.actions.useMove(m, source, target);
	},
	num: -3030,
	gen: 9,
}
