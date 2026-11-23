/*
 * Runerigus Crest (Pokemon Rejuvenation)
 * Once per battle, curses opponent upon hit. Heals 1/16 HP per turn.
 */
{
	name: "Runerigus Crest",
	spritenum: 0,
	itemUser: ["Runerigus"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Runerigus');
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Runerigus') || source === target || target.m.runerigusCrestUsed || source.volatiles['curse']) return;
		target.m.runerigusCrestUsed = true;
		this.add('-activate', target, 'item: ' + this.effect.name);
		source.addVolatile('curse', target);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Runerigus')) return;
		this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2048,
	gen: 9,
}
