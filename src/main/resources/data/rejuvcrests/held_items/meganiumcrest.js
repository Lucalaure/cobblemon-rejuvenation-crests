/*
 * Meganium Crest (Pokemon Rejuvenation)
 * Meganium and its allies take reduced damage and recover every turn.
 */
{
	name: "Meganium Crest",
	spritenum: 0,
	itemUser: ["Meganium"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Meganium');
	},
	onAnyModifyDamage(damage, source, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Meganium') || !target || source === target) return;
		if (target === holder || target.isAlly(holder)) return this.chainModify(0.8);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Meganium')) return;
		this.heal(pokemon.baseMaxhp / 8);
		for (const ally of pokemon.adjacentAllies()) this.heal(ally.baseMaxhp / 16, ally, pokemon);
	},
	num: -2037,
	gen: 9,
}
