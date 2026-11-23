/*
 * Furret Crest (Pokemon Rejuvenation)
 * Upon switching in, Furret loses 25% of its Max HP to create a substitute.
 */
{
	name: "Furret Crest",
	spritenum: 0,
	itemUser: ["Furret"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Furret');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Furret') || pokemon.volatiles['substitute']) return;
		if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.maxhp === 1) {
			this.add('-fail', pokemon, 'move: Substitute', '[weak]');
			return;
		}
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.directDamage(pokemon.maxhp / 4, pokemon);
		pokemon.addVolatile('substitute');
	},
	num: -2026,
	gen: 9,
}
