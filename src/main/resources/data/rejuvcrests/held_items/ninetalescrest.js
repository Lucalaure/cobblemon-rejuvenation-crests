/*
 * Ninetales Crest (Pokemon Rejuvenation)
 * Grants Ghost STAB and resistances. Disables opponent's move upon hit.
 */
{
	name: "Ninetales Crest",
	spritenum: 0,
	itemUser: ["Ninetales"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Ninetales');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Ninetales') && move.type === 'Ghost') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Ninetales') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Ghost');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Ninetales') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Ghost')) {
			this.add('-immune', target);
			return null;
		}
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Ninetales') || source === target || source.volatiles['disable']) return;
		if (move.isMax || move.flags['futuremove'] || move.id === 'struggle') return;
		if (source.addVolatile('disable', target) && source.volatiles['disable']) source.volatiles['disable'].duration = 2;
	},
	num: -2040,
	gen: 9,
}
