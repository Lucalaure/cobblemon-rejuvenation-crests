/*
 * Kricketune Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Special moves use Attack, and its other stats gain 25% of its Attack. Physical and sound moves raise its and its ally's stats.
 */
{
	name: "Kricketune Crest",
	spritenum: 0,
	itemUser: ["Kricketune"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Kricketune');
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Kricketune')) return Math.floor(def * (pokemon.storedStats.def + 0.25 * pokemon.storedStats.atk) / pokemon.storedStats.def);
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Kricketune')) return Math.floor(spd * (pokemon.storedStats.spd + 0.25 * pokemon.storedStats.atk) / pokemon.storedStats.spd);
	},
	onModifySpePriority: 2,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Kricketune')) return Math.floor(spe * (pokemon.storedStats.spe + 0.25 * pokemon.storedStats.atk) / pokemon.storedStats.spe);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Kricketune') && move.category === 'Special' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'atk';
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Kricketune') || source.fainted) return;
		let boosts = null;
		if (move.category === 'Physical') boosts = {atk: 1, accuracy: 1};
		else if (move.category === 'Special' && move.flags['sound']) boosts = {spa: 1, spe: 1};
		else if (move.category === 'Status' && move.flags['sound']) boosts = {def: 1, spd: 1};
		if (move.id === 'healbell') for (const p of [source, ...source.adjacentAllies()]) this.heal(p.baseMaxhp / 4, p, source);
		if (!boosts) return;
		this.add('-activate', source, 'item: ' + this.effect.name);
		for (const p of [source, ...source.adjacentAllies()]) if (!p.fainted) this.boost({...boosts}, p, source);
	},
	num: -3022,
	gen: 9,
}
