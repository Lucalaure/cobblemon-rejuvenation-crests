/*
 * Leavanny Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * On switch-in, spends 25% HP to make a substitute for itself or a weaker ally.
 */
{
	name: "Leavanny Crest",
	spritenum: 0,
	itemUser: ["Leavanny"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Leavanny');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Leavanny')) return;
		const ally = pokemon.adjacentAllies().find(a => !a.fainted && a.hp < pokemon.hp && !a.volatiles['substitute']);
		const target = ally || pokemon;
		if (target.volatiles['substitute']) return;
		if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.maxhp === 1) {
			this.add('-fail', pokemon, 'move: Substitute', '[weak]');
			return;
		}
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.directDamage(pokemon.maxhp / 4, pokemon);
		target.addVolatile('substitute');
	},
	num: -3024,
	gen: 9,
}
