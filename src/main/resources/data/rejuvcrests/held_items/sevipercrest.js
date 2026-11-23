/*
 * Seviper Crest (Pokemon Rejuvenation)
 * Seviper deals more damage against healthier foes, up to 50%. Speed increased by 50%.
 */
{
	name: "Seviper Crest",
	spritenum: 0,
	itemUser: ["Seviper"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Seviper');
	},
	onModifySpePriority: 1,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Seviper')) return this.chainModify(1.5);
	},
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Seviper') && target) return this.chainModify(1 + 0.5 * target.hp / target.maxhp);
	},
	num: -2053,
	gen: 9,
}
