/*
 * Unfezant Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Special moves use Attack. +1 crit ratio for its side. Crits lower the foe's Attack (male) or heal the attacker (female).
 */
{
	name: "Unfezant Crest",
	spritenum: 0,
	itemUser: ["Unfezant"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Unfezant');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Unfezant') && move.category === 'Special' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'atk';
	},
	onAllyModifyCritRatio(critRatio, source) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Unfezant')) return critRatio + 1;
	},
	onAnyDamagingHit(damage, target, source, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Unfezant') || !source || (source !== holder && !source.isAlly(holder)) || target.isAlly(holder)) return;
		if (!target.getMoveHitData(move).crit) return;
		this.add('-activate', holder, 'item: ' + this.effect.name);
		if (holder.gender === 'F') this.heal(Math.max(damage / 8, source.baseMaxhp / 8), source, holder);
		else if (!target.fainted) this.boost({atk: -1}, target, source);
	},
	num: -3042,
	gen: 9,
}
