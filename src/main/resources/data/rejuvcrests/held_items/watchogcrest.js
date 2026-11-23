/*
 * Watchog Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Defenses rise the slower it is than its foe. Inaccurate moves become more accurate and more powerful.
 */
{
	name: "Watchog Crest",
	spritenum: 0,
	itemUser: ["Watchog"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Watchog');
	},
	watchRatio(pokemon) {
		const foe = pokemon.adjacentFoes()[0];
		if (!foe) return 1;
		return Math.min(1.75, foe.getStat('spe') / Math.max(1, pokemon.getStat('spe')));
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Watchog')) return this.chainModify(this.effect.watchRatio(pokemon));
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Watchog')) return this.chainModify(this.effect.watchRatio(pokemon));
	},
	onSourceModifyAccuracyPriority: -1,
	onSourceModifyAccuracy(accuracy, target, source, move) {
		if (typeof accuracy === 'number' && (source.baseSpecies.baseSpecies === 'Watchog')) return this.chainModify(1 + (100 - Math.min(100, accuracy)) * 0.01);
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Watchog') && typeof move.accuracy === 'number' && move.accuracy < 100) return this.chainModify(1 + ((100 - move.accuracy) / 2) * 0.01);
	},
	num: -3046,
	gen: 9,
}
