/*
 * Spiritomb Crest (Pokemon Rejuvenation)
 * Spiritomb becomes stronger for each defeated ally. Recovers health based on KO'd enemies.
 */
{
	name: "Spiritomb Crest",
	spritenum: 0,
	itemUser: ["Spiritomb"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Spiritomb');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Spiritomb')) return;
		const fainted = pokemon.side.pokemon.filter(p => p !== pokemon && p.fainted).length;
		if (fainted) return this.chainModify(1 + 0.2 * fainted);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Spiritomb')) return;
		const fainted = pokemon.side.pokemon.filter(p => p !== pokemon && p.fainted).length;
		if (fainted) return this.chainModify(1 + 0.2 * fainted);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Spiritomb')) return;
		const foesFainted = pokemon.side.foe.pokemon.filter(p => p.fainted).length;
		if (foesFainted) this.heal(pokemon.baseMaxhp * foesFainted / 16);
	},
	num: -2060,
	gen: 9,
}
