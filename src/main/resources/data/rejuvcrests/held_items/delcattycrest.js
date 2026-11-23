/*
 * Delcatty Crest (Pokemon Rejuvenation)
 * The power of its non-KO'd friends increases Delcatty's stats by 10% each.
 */
{
	name: "Delcatty Crest",
	spritenum: 0,
	itemUser: ["Delcatty"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Delcatty');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delcatty')) return;
		const bonus = pokemon.side.pokemon.filter(p => p !== pokemon && !p.fainted).reduce((sum, p) => sum + 0.1 * p.storedStats.atk, 0);
		if (bonus) return Math.floor(atk * (pokemon.storedStats.atk + bonus) / pokemon.storedStats.atk);
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delcatty')) return;
		const bonus = pokemon.side.pokemon.filter(p => p !== pokemon && !p.fainted).reduce((sum, p) => sum + 0.1 * p.storedStats.def, 0);
		if (bonus) return Math.floor(def * (pokemon.storedStats.def + bonus) / pokemon.storedStats.def);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delcatty')) return;
		const bonus = pokemon.side.pokemon.filter(p => p !== pokemon && !p.fainted).reduce((sum, p) => sum + 0.1 * p.storedStats.spa, 0);
		if (bonus) return Math.floor(spa * (pokemon.storedStats.spa + bonus) / pokemon.storedStats.spa);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delcatty')) return;
		const bonus = pokemon.side.pokemon.filter(p => p !== pokemon && !p.fainted).reduce((sum, p) => sum + 0.1 * p.storedStats.spd, 0);
		if (bonus) return Math.floor(spd * (pokemon.storedStats.spd + bonus) / pokemon.storedStats.spd);
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delcatty')) return;
		const bonus = pokemon.side.pokemon.filter(p => p !== pokemon && !p.fainted).reduce((sum, p) => sum + 0.1 * p.storedStats.spe, 0);
		if (bonus) return Math.floor(spe * (pokemon.storedStats.spe + bonus) / pokemon.storedStats.spe);
	},
	num: -2014,
	gen: 9,
}
