/*
 * Beheeyem Crest (Pokemon Rejuvenation)
 * Beheeyem disables an opponent's move when attacked. Faster opponents do reduced damage to Beheeyem.
 */
{
	name: "Beheeyem Crest",
	spritenum: 0,
	itemUser: ["Beheeyem"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Beheeyem');
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Beheeyem') || source === target || source.volatiles['disable']) return;
		if (move.isMax || move.flags['futuremove'] || move.id === 'struggle') return;
		source.addVolatile('disable', target);
	},
	onSourceModifyDamage(damage, source, target, move) {
		if ((target.baseSpecies.baseSpecies === 'Beheeyem') && !target.moveThisTurn) return this.chainModify([2744, 4096]);
	},
	num: -2004,
	gen: 9,
}
