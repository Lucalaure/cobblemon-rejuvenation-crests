/*
 * Skuntank Crest (Pokemon Rejuvenation)
 * Nullifies damage and boosts Attack when hit by a Ground-type move. Increases Attack and Sp. Atk by 20%.
 */
{
	name: "Skuntank Crest",
	spritenum: 0,
	itemUser: ["Skuntank"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Skuntank');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Skuntank')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Skuntank')) return this.chainModify(1.2);
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target !== source && (target.baseSpecies.baseSpecies === 'Skuntank') && move.type === 'Ground') {
			if (!this.boost({atk: 1}, target, target)) this.add('-immune', target, '[from] item: ' + this.effect.name);
			return null;
		}
	},
	num: -2057,
	gen: 9,
}
