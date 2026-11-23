/*
 * Ariados Crest (Pokemon Rejuvenation)
 * Ariados's speed is increased by 50% and cannot be lowered. Deals critical hits against slowed or poisoned targets.
 */
{
	name: "Ariados Crest",
	spritenum: 0,
	itemUser: ["Ariados"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Ariados');
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Ariados')) return this.chainModify(1.5);
	},
	onTryBoost(boost, target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Ariados') || !boost.spe || boost.spe > 0) return;
		delete boost.spe;
		if (!effect.secondaries) this.add('-fail', target, 'unboost', 'Speed', '[from] item: ' + this.effect.name, '[of] ' + target);
	},
	onModifyCritRatio(critRatio, source, target) {
		if ((source.baseSpecies.baseSpecies === 'Ariados') && target && (['psn', 'tox'].includes(target.status) || target.boosts.spe < 0)) return 5;
	},
	num: -2002,
	gen: 9,
}
