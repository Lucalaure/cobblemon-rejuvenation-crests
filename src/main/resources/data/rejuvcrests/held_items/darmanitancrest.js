/*
 * Darmanitan Crest (Pokemon Rejuvenation)
 * Darmanitan is forced into Zen Mode while holding this crest.
 */
{
	name: "Darmanitan Crest",
	spritenum: 0,
	itemUser: ["Darmanitan"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Darmanitan') && !pokemon.baseSpecies.forme);
	},
	onStart(pokemon) {
		if (!((pokemon.baseSpecies.baseSpecies === 'Darmanitan') && !pokemon.baseSpecies.forme) || pokemon.species.forme === 'Zen') return;
		const zen = this.dex.species.get('Darmanitan-Zen');
		if (zen.exists) pokemon.formeChange(zen, this.effect, false, '[msg]');
	},
	num: -2012,
	gen: 9,
}
