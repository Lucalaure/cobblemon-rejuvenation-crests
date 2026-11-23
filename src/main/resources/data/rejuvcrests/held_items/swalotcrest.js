/*
 * Swalot Crest (Pokemon Rejuvenation)
 * Stockpiles gained after an attack. Belch always usable and followed by Spit Up.
 */
{
	name: "Swalot Crest",
	spritenum: 0,
	itemUser: ["Swalot"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Swalot');
	},
	onStart(pokemon) {
		/* Belch is always usable. */
		if ((pokemon.baseSpecies.baseSpecies === 'Swalot')) pokemon.ateBerry = true;
	},
	onAfterMoveSecondarySelf(pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Swalot') || move.category === 'Status' || move.rejuvSwalot) return;
		if (move.id === 'belch' && target && !target.fainted) {
			const spitup = this.dex.getActiveMove('spitup');
			spitup.rejuvSwalot = true;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			this.actions.useMove(spitup, pokemon, target);
		}
		if (!pokemon.fainted) pokemon.addVolatile('stockpile');
	},
	num: -2064,
	gen: 9,
}
