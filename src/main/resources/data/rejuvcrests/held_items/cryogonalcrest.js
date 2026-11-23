/*
 * Cryogonal Crest (Pokemon Rejuvenation)
 * Increases Cryogonal's Sp. Def by 20%, then increases its other stats by 10% of its Sp. Def.
 */
{
	name: "Cryogonal Crest",
	spritenum: 0,
	itemUser: ["Cryogonal"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Cryogonal');
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cryogonal')) return this.chainModify(1.2);
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cryogonal')) return Math.floor(atk * (pokemon.storedStats.atk + 0.12 * pokemon.storedStats.spd) / pokemon.storedStats.atk);
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cryogonal')) return Math.floor(def * (pokemon.storedStats.def + 0.12 * pokemon.storedStats.spd) / pokemon.storedStats.def);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cryogonal')) return Math.floor(spa * (pokemon.storedStats.spa + 0.12 * pokemon.storedStats.spd) / pokemon.storedStats.spa);
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Cryogonal')) return Math.floor(spe * (pokemon.storedStats.spe + 0.12 * pokemon.storedStats.spd) / pokemon.storedStats.spe);
	},
	num: -2011,
	gen: 9,
}
