/*
 * Pyroar Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Uses Noble Roar on switch-in. Special moves use its Attack boosts.
 */
{
	name: "Pyroar Crest",
	spritenum: 0,
	itemUser: ["Pyroar"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Pyroar');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Pyroar')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.actions.useMove('nobleroar', pokemon);
	},
	onModifySpAPriority: 2,
	onModifySpA(spa, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Pyroar')) return;
		const mult = b => b >= 0 ? (2 + b) / 2 : 2 / (2 - b);
		return Math.floor(spa * mult(pokemon.boosts.atk) / mult(pokemon.boosts.spa));
	},
	num: -3034,
	gen: 9,
}
