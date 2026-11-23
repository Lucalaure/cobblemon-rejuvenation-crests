/*
 * Whiscash Crest (Pokemon Rejuvenation)
 * Nullifies damage and boosts Attack when hit by a Grass-type move. Increase Atk and Sp. Atk by 20%.
 */
{
	name: "Whiscash Crest",
	spritenum: 0,
	itemUser: ["Whiscash"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Whiscash');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Whiscash')) return this.chainModify(1.2);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Whiscash')) return this.chainModify(1.2);
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target !== source && (target.baseSpecies.baseSpecies === 'Whiscash') && move.type === 'Grass') {
			if (!this.boost({atk: 1}, target, target)) this.add('-immune', target, '[from] item: ' + this.effect.name);
			return null;
		}
	},
	num: -2068,
	gen: 9,
}
