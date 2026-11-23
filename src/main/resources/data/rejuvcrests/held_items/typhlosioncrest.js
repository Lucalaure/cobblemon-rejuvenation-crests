/*
 * Typhlosion Crest (Pokemon Rejuvenation)
 * Typhlosion's Attack is equivalent with Sp. Atk, and contact moves do an additional hit of damage.
 */
{
	name: "Typhlosion Crest",
	spritenum: 0,
	itemUser: ["Typhlosion"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Typhlosion') && !pokemon.baseSpecies.forme);
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Typhlosion') && !pokemon.baseSpecies.forme)) return Math.floor(atk * pokemon.storedStats.spa / pokemon.storedStats.atk);
	},
	onPrepareHit(source, target, move) {
		if (!((source.baseSpecies.baseSpecies === 'Typhlosion') && !source.baseSpecies.forme) || move.category === 'Status' || move.multihit || !move.flags['contact']) return;
		if (move.flags['noparentalbond'] || move.flags['charge'] || move.flags['futuremove'] || move.spreadHit || move.isZ || move.isMax) return;
		move.multihit = 2;
		move.multihitType = 'rejuvcrest';
	},
	onBasePowerPriority: 7,
	onBasePower(basePower, pokemon, target, move) {
		if (move.multihitType === 'rejuvcrest' && move.hit > 1) return this.chainModify(0.3);
	},
	num: -2065,
	gen: 9,
}
