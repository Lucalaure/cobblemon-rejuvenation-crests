/*
 * Minior Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * With its shell broken, its Rock moves switch to its core color's type when that's more effective.
 */
{
	name: "Minior Crest",
	spritenum: 0,
	itemUser: ["Minior"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Minior');
	},
	coreType(pokemon) {
		const colors = {red: 'Fire', orange: 'Steel', yellow: 'Electric', green: 'Grass', blue: 'Water', indigo: 'Dark', violet: 'Poison'};
		const forme = (pokemon.baseSpecies.forme || 'red').toLowerCase();
		return colors[forme] || 'Fire';
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Minior') || move.type !== 'Rock' || move.category === 'Status') return;
		if ((pokemon.species.forme || '').includes('Meteor')) return;
		const foe = pokemon.adjacentFoes()[0];
		if (!foe) return;
		const t = this.effect.coreType(pokemon);
		const score = x => foe.runImmunity(x) ? this.dex.getEffectiveness(x, foe) : -9;
		if (score(t) > score('Rock')) move.type = t;
	},
	num: -3028,
	gen: 9,
}
