/*
 * Infernape Crest (Pokemon Rejuvenation)
 * Infernape's Attacking and Defensive stats are equalized. 1/16th Max HP is restored every turn.
 */
{
	name: "Infernape Crest",
	spritenum: 0,
	itemUser: ["Infernape"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Infernape');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Infernape')) return Math.floor(def * pokemon.storedStats.atk / pokemon.storedStats.def);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Infernape')) return Math.floor(spd * pokemon.storedStats.spa / pokemon.storedStats.spd);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Infernape')) return;
		this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2028,
	gen: 9,
}
