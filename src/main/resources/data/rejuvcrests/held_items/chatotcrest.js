/*
 * Chatot Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Sound moves are 20% stronger and always confuse. Copies sound moves used by others.
 */
{
	name: "Chatot Crest",
	spritenum: 0,
	itemUser: ["Chatot"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Chatot');
	},
	onAllyBasePowerPriority: 22,
	onAllyBasePower(basePower, attacker, defender, move) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Chatot') && move.flags['sound']) return this.chainModify(1.2);
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Chatot') || !move.flags['sound']) return;
		for (const foe of source.adjacentFoes()) {
			if (!foe.fainted && foe.addVolatile('confusion', source)) this.add('-activate', source, 'item: ' + this.effect.name);
		}
	},
	onAnyAfterMove(user, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Chatot') || user === holder || !move.flags['sound'] || move.isExternal || holder.fainted || !holder.isActive) return;
		this.add('-activate', holder, 'item: ' + this.effect.name);
		this.add('-message', holder.name + ' mimicked the sounds!');
		const t = target && !target.isAlly(holder) ? target : user;
		this.actions.runMove(move.id, holder, holder.getLocOf(t), this.effect, undefined, true);
	},
	num: -3007,
	gen: 9,
}
