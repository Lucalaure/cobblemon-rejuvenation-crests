/*
 * Cacturne Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Lays Spikes when hit. +1 priority on its first turn and for damaging moves of 60 power or less.
 */
{
	name: "Cacturne Crest",
	spritenum: 0,
	itemUser: ["Cacturne"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Cacturne');
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Cacturne') || source === target) return;
		if (source.side.addSideCondition('spikes', target)) this.add('-activate', target, 'item: ' + this.effect.name);
	},
	onModifyPriority(priority, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Cacturne') || move.category === 'Status') return;
		if (pokemon.activeMoveActions === 0 || move.basePower <= 60) return priority + 1;
	},
	num: -3005,
	gen: 9,
}
