/*
 * Gourgeist Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Every 2 turns it plays Trick-or-Treat after moving, with effects depending on its size.
 */
{
	name: "Gourgeist Crest",
	spritenum: 0,
	itemUser: ["Gourgeist"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Gourgeist');
	},
	onAfterMove(source, target, move) {
		/* Every 2 turns after moving: Trick-or-Treat with size-based extras. */
		if (!(source.baseSpecies.baseSpecies === 'Gourgeist') || move.id === 'trickortreat' || source.fainted) return;
		if (source.activeTurns < 2 || source.activeTurns % 2 !== 0) return;
		const size = (source.baseSpecies.forme || '').toLowerCase();
		let victim = target && !target.fainted && target !== source ? target : source.adjacentFoes()[0];
		if (!victim) victim = source.adjacentAllies().find(a => !a.fainted) || source;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.add('-message', source.name + ' calls for Trick-or-Treating!');
		if (!victim.hasType('Ghost') && victim.addType('Ghost')) this.add('-start', victim, 'typeadd', 'Ghost', '[from] move: Trick-or-Treat');
		const stats = ['atk', 'def', 'spa', 'spd', 'spe'];
		if (victim === source || victim.isAlly(source)) {
			this.boost({[this.sample(stats)]: 1}, victim, source);
			if (size === 'small') this.boost({[this.sample(stats)]: 1}, victim, source);
			if (size === 'super') this.heal(victim.baseMaxhp / 8, victim, source);
		} else {
			this.boost({[this.sample(stats)]: -1}, victim, source);
			if (size === 'small') victim.addVolatile('embargo', source);
			if (size === 'super' && !victim.hasType('Grass')) victim.addVolatile('leechseed', source);
		}
	},
	num: -3020,
	gen: 9,
}
