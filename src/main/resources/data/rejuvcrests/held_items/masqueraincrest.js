/*
 * Masquerain Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Turns its Flying type into Water but keeps Flying STAB and resistances. Gains Aqua Ring.
 */
{
	name: "Masquerain Crest",
	spritenum: 0,
	itemUser: ["Masquerain"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Masquerain');
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Masquerain') && move.type === 'Flying') move.forceSTAB = true;
	},
	onEffectiveness(typeMod, target, type, move) {
		if (!target || !(target.baseSpecies.baseSpecies === 'Masquerain') || type !== target.getTypes()[0]) return;
		const extra = this.dex.getEffectiveness(move.type, 'Flying');
		if (extra < 0) return typeMod + extra;
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Masquerain') || move.category === 'Status') return;
		if (!this.dex.getImmunity(move.type, 'Flying')) {
			this.add('-immune', target);
			return null;
		}
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Masquerain')) return;
		const types = pokemon.getTypes().map(t => t === 'Flying' ? 'Water' : t);
		if (pokemon.setType(types)) this.add('-start', pokemon, 'typechange', types.join('/'), '[from] item: ' + this.effect.name);
		pokemon.addVolatile('aquaring');
	},
	num: -3027,
	gen: 9,
}
