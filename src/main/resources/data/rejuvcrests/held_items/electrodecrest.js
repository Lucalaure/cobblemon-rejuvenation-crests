/*
 * Electrode Crest (Pokemon Rejuvenation)
 * The target's Defense stat is halved when Kantonian Electrode is attacking. Non-Attack and Speed stats are also boosted by 10% of Speed.
 */
{
	name: "Electrode Crest",
	spritenum: 0,
	itemUser: ["Electrode"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Electrode') && !pokemon.baseSpecies.forme);
	},
	onSourceModifyDefPriority: 1,
	onSourceModifyDef(def, target, source) {
		if (((source.baseSpecies.baseSpecies === 'Electrode') && !source.baseSpecies.forme)) return this.chainModify(0.5);
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Electrode') && !pokemon.baseSpecies.forme)) return Math.floor(def * (pokemon.storedStats.def + 0.1 * pokemon.storedStats.spe) / pokemon.storedStats.def);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Electrode') && !pokemon.baseSpecies.forme)) return Math.floor(spa * (pokemon.storedStats.spa + 0.1 * pokemon.storedStats.spe) / pokemon.storedStats.spa);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Electrode') && !pokemon.baseSpecies.forme)) return Math.floor(spd * (pokemon.storedStats.spd + 0.1 * pokemon.storedStats.spe) / pokemon.storedStats.spd);
	},
	num: -2017,
	gen: 9,
}
