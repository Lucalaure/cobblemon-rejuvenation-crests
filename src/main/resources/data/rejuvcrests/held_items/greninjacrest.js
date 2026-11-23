/*
 * Greninja Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Water Shuriken takes on whichever of the foe's own types hits it hardest.
 */
{
	name: "Greninja Crest",
	spritenum: 0,
	itemUser: ["Greninja"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Greninja');
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Greninja') || move.id !== 'watershuriken') return;
		const foe = pokemon.adjacentFoes()[0];
		if (!foe) return;
		const types = foe.getTypes();
		const score = t => foe.runImmunity(t) ? this.dex.getEffectiveness(t, foe) : -9;
		move.type = types.reduce((best, t) => score(t) > score(best) ? t : best, types[0]);
	},
	num: -3021,
	gen: 9,
}
