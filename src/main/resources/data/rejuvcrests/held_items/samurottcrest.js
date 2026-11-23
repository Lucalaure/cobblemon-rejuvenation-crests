/*
 * Samurott Crest (Pokemon Rejuvenation)
 * Unovan Samurott gains Fighting-type STAB and resistances. Slicing moves always result in critical hit.
 */
{
	name: "Samurott Crest",
	spritenum: 0,
	itemUser: ["Samurott"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Samurott') && !pokemon.baseSpecies.forme);
	},
	onModifyMove(move, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Samurott') && !pokemon.baseSpecies.forme) && move.type === 'Fighting') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !((target.baseSpecies.baseSpecies === 'Samurott') && !target.baseSpecies.forme) || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Fighting');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !((target.baseSpecies.baseSpecies === 'Samurott') && !target.baseSpecies.forme) || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Fighting')) {
			this.add('-immune', target);
			return null;
		}
	},
	onModifyCritRatio(critRatio, source, target, move) {
		if (((source.baseSpecies.baseSpecies === 'Samurott') && !source.baseSpecies.forme) && move && move.flags['slicing']) return 5;
	},
	num: -2049,
	gen: 9,
}
