/*
 * Silvally Crest (Pokemon Rejuvenation)
 * Has a special effect for each held Memory. Attack and SpAtk. increase by 20%.
 */
{
	name: "Silvally Crest",
	spritenum: 0,
	itemUser: ["Silvally"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Silvally');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Silvally')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Silvally')) return this.chainModify(1.2);
	},
	/* Holding the crest means Silvally holds no Memory, which Rejuvenation maps to Scrappy. */
	onModifyMovePriority: -5,
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Silvally')) return;
		if (!move.ignoreImmunity) move.ignoreImmunity = {};
		if (move.ignoreImmunity !== true) {
			move.ignoreImmunity['Fighting'] = true;
			move.ignoreImmunity['Normal'] = true;
		}
	},
	onTryBoost(boost, target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Silvally') && effect.name === 'Intimidate' && boost.atk) {
			delete boost.atk;
			this.add('-fail', target, 'unboost', 'Attack', '[from] item: ' + this.effect.name, '[of] ' + target);
		}
	},
	num: -2055,
	gen: 9,
}
