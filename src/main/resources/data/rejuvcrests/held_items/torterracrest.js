/*
 * Torterra Crest (Pokemon Rejuvenation)
 * Torterra's resistances and weaknesses are swapped, retaining immunities. Attacks restore HP.
 */
{
	name: "Torterra Crest",
	spritenum: 0,
	itemUser: ["Torterra"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Torterra');
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Torterra') || move.category === 'Status') return;
		return -typeMod;
	},
	onAfterMoveSecondarySelfPriority: -1,
	onAfterMoveSecondarySelf(pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Torterra') && move.totalDamage && !pokemon.forceSwitchFlag) this.heal(move.totalDamage / 8, pokemon);
	},
	num: -2064,
	gen: 9,
}
