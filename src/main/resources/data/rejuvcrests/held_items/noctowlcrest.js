/*
 * Noctowl Crest (Pokemon Rejuvenation)
 * Increases Special Defense upon being hit. Increases Defense by 30%.
 */
{
	name: "Noctowl Crest",
	spritenum: 0,
	itemUser: ["Noctowl"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Noctowl');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Noctowl')) return this.chainModify(1.3);
	},
	onDamagingHit(damage, target, source, move) {
		if ((target.baseSpecies.baseSpecies === 'Noctowl') && source !== target) this.boost({spd: 1}, target, target);
	},
	num: -2039,
	gen: 9,
}
