/*
 * Minun Crest (Pokemon Rejuvenation)
 * Activates Minus. Weakens the power of physical moves targetting the user and its partner by 33%.
 */
{
	name: "Minun Crest",
	spritenum: 0,
	itemUser: ["Minun"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Minun');
	},
	onModifySpAPriority: 5,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Minun') && pokemon.hasAbility(['plus', 'minus'])) return this.chainModify(1.5);
	},
	onAnyModifyDamage(damage, source, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Minun') || !target || move.category !== 'Physical' || source.isAlly(holder)) return;
		if (target === holder || target.isAlly(holder)) return this.chainModify([2731, 4096]);
	},
	num: -2039,
	gen: 9,
}
