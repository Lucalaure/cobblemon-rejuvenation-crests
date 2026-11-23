/*
 * Thievul Crest (Pokemon Rejuvenation)
 * Decreases opponent's Sp. Atk by one stage, increasing Thievul's by one stage on switch.
 */
{
	name: "Thievul Crest",
	spritenum: 0,
	itemUser: ["Thievul"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Thievul');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Thievul')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		for (const foe of pokemon.adjacentFoes()) this.boost({spa: -1}, foe, pokemon, null, true);
		this.boost({spa: 1}, pokemon, pokemon);
	},
	num: -2063,
	gen: 9,
}
