/*
 * Xatu Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Keeps Future Sight active. When Future Sight knocks out a foe, Xatu raises its defenses and heals.
 */
{
	name: "Xatu Crest",
	spritenum: 0,
	itemUser: ["Xatu"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Xatu');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Xatu')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		const foe = pokemon.adjacentFoes()[0];
		if (foe) this.actions.useMove('futuresight', pokemon, foe);
	},
	onResidualOrder: 30,
	onResidual(pokemon) {
		/* Keep a Future Sight pending at all times. */
		if (!(pokemon.baseSpecies.baseSpecies === 'Xatu')) return;
		const foe = pokemon.adjacentFoes()[0];
		if (!foe || foe.side.slotConditions[foe.position]['futuremove']) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.actions.useMove('futuresight', pokemon, foe);
	},
	onAnyFaint(target, source, effect) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Xatu') || !effect || effect.id !== 'futuresight' || target.isAlly(holder) || !holder.isActive) return;
		this.add('-activate', holder, 'item: ' + this.effect.name);
		this.boost({def: 1, spd: 1}, holder, holder);
		this.heal(holder.baseMaxhp / 4, holder, holder);
	},
	num: -3047,
	gen: 9,
}
