/*
 * Delphox Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Mystical Fire becomes Psychic-type when that's more effective, and deals 20% more to foes holding an item.
 */
{
	name: "Delphox Crest",
	spritenum: 0,
	itemUser: ["Delphox"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Delphox');
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delphox') || move.id !== 'mysticalfire') return;
		const foe = pokemon.adjacentFoes()[0];
		if (!foe) return;
		const score = t => foe.runImmunity(t) ? this.dex.getEffectiveness(t, foe) : -9;
		if (score('Psychic') > score('Fire')) move.type = 'Psychic';
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delphox') && move.id === 'mysticalfire' && target && target.item) return this.chainModify(1.2);
	},
	num: -3012,
	gen: 9,
}
