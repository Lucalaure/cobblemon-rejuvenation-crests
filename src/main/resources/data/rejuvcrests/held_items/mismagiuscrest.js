/*
 * Mismagius Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Gains the Fairy type. Hex calls a follow-up move depending on its move slot.
 */
{
	name: "Mismagius Crest",
	spritenum: 0,
	itemUser: ["Mismagius"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Mismagius');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Mismagius') || pokemon.hasType('Fairy')) return;
		const types = [pokemon.getTypes()[0], 'Fairy'];
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Mismagius') || move.id !== 'hex' || move.rejuvFollowUp || !target || target.fainted) return;
		const slot = source.moveSlots.findIndex(s => s.id === 'hex');
		const follow = ['venoshock', 'mysticalfire', 'icywind', 'mist'][Math.max(0, slot)];
		const m = this.dex.getActiveMove(follow);
		m.rejuvFollowUp = true;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.actions.useMove(m, source, target);
	},
	num: -3029,
	gen: 9,
}
