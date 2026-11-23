/*
 * Flygon Crest (Pokemon Rejuvenation)
 * Boosts own-side Sound moves by 50%. Own side immune to each other's Sound moves. Sound moves scale off Attack.
 */
{
	name: "Flygon Crest",
	spritenum: 0,
	itemUser: ["Flygon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Flygon');
	},
	onAllyBasePowerPriority: 22,
	onAllyBasePower(basePower, attacker, defender, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Flygon') && move.flags['sound']) return this.chainModify(1.5);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Flygon') && move.flags['sound'] && move.category !== 'Status' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'atk';
	},
	onAllyTryHitSide(target, source, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Flygon') && move.flags['sound'] && source.isAlly(target) && source !== target) return null;
	},
	onAllyTryHit(target, source, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Flygon') && move.flags['sound'] && source.isAlly(target) && source !== target) {
			this.add('-immune', target);
			return null;
		}
	},
	num: -2023,
	gen: 9,
}
