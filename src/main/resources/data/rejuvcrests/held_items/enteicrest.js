/*
 * Entei Crest (Pokemon Rejuvenation)
 * Fire moves become spread moves, all moves scale in BP based on how much total HP Entei has.
 */
{
	name: "Entei Crest",
	spritenum: 0,
	itemUser: ["Entei"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Entei');
	},
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Entei') || move.type !== 'Fire' || move.category === 'Status') return;
		if (['normal', 'any', 'adjacentFoe', 'randomNormal'].includes(move.target)) move.target = 'allAdjacentFoes';
		move.spreadModifier = 1;
	},
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Entei')) return this.chainModify(Math.min(1.5, Math.max(1.3, 1 + Math.floor(source.maxhp / 1000))));
	},
	num: -2021,
	gen: 9,
}
