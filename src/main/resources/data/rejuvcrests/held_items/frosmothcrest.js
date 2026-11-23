/*
 * Frosmoth Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Blocks the first Fire-type attack after switching in, hurting the attacker. Takes 25% less damage from physical moves.
 */
{
	name: "Frosmoth Crest",
	spritenum: 0,
	itemUser: ["Frosmoth"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Frosmoth');
	},
	onStart(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Frosmoth')) this.effectState.sporesUsed = false;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Frosmoth') || move.type !== 'Fire' || move.category === 'Status' || this.effectState.sporesUsed) return;
		this.effectState.sporesUsed = true;
		this.add('-activate', target, 'item: ' + this.effect.name);
		this.add('-message', target.name + "'s icy scales exploded!");
		const eff = Math.pow(2, source.runEffectiveness(move));
		if (source.runImmunity('Fire')) this.damage(source.baseMaxhp * eff / 4, source, target);
		return null;
	},
	onSourceModifyDamage(damage, source, target, move) {
		if ((target.baseSpecies.baseSpecies === 'Frosmoth') && move.category === 'Physical') return this.chainModify(0.75);
	},
	num: -3018,
	gen: 9,
}
