/*
 * Luvdisc Crest (Pokemon Rejuvenation)
 * The Base Power of all damaging moves matches Luvdisc's happiness, capping at a Base Power of 250.
 */
{
	name: "Luvdisc Crest",
	spritenum: 0,
	itemUser: ["Luvdisc"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Luvdisc');
	},
	onBasePowerPriority: 40,
	onBasePower(basePower, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Luvdisc') || !basePower) return;
		const happiness = typeof pokemon.happiness === 'number' ? pokemon.happiness : 255;
		if (move.id === 'frustration') return Math.max(250 - happiness, 1);
		return Math.min(happiness, 250);
	},
	num: -2034,
	gen: 9,
}
