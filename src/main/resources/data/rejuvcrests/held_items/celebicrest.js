/*
 * Celebi Crest (Pokemon Rejuvenation)
 * Holder makes time pass quicker, doubling the amount of turns that pass.
 */
{
	name: "Celebi Crest",
	spritenum: 0,
	itemUser: ["Celebi"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Celebi');
	},
	/* Time passes twice as fast: the end-of-turn phase runs a second time. */
	onResidualOrder: 99,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Celebi') || this.effectState.extraTurn) return;
		this.effectState.extraTurn = true;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		try {
			if (typeof this.residualEvent === 'function') this.residualEvent('Residual');
			else this.fieldEvent('Residual');
		} finally {
			this.effectState.extraTurn = false;
		}
	},
	num: -2005,
	gen: 9,
}
