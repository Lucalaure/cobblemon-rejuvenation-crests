/*
 * Shiinotic Crest (Pokemon Rejuvenation)
 * Draining effects and Sp. Def boosted by 30%. Spotlight applied to Partner on entry.
 */
{
	name: "Shiinotic Crest",
	spritenum: 0,
	itemUser: ["Shiinotic"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Shiinotic');
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Shiinotic')) return this.chainModify(1.3);
	},
	onTryHealPriority: 1,
	onTryHeal(damage, target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Shiinotic')) return;
		const heals = ['drain', 'leechseed', 'ingrain', 'aquaring', 'strengthsap'];
		if (heals.includes(effect.id)) return this.chainModify([5325, 4096]);
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Shiinotic')) return;
		const ally = pokemon.adjacentAllies()[0];
		if (ally && !ally.fainted && ally.addVolatile('spotlight')) this.add('-activate', pokemon, 'item: ' + this.effect.name);
	},
	num: -2054,
	gen: 9,
}
