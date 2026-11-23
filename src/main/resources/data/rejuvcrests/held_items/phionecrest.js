/*
 * Phione Crest (Pokemon Rejuvenation)
 * Phione is granted a 50% increase in defenses and Aqua Ring.
 */
{
	name: "Phione Crest",
	spritenum: 0,
	itemUser: ["Phione"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Phione');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Phione')) return this.chainModify(1.5);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Phione')) return this.chainModify(1.5);
	},
	onStart(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Phione')) pokemon.addVolatile('aquaring');
	},
	num: -2043,
	gen: 9,
}
