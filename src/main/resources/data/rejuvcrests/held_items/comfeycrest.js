/*
 * Comfey Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * HP-draining moves also heal its ally by half as much. Draining is stronger while its ally is at full HP or it's alone.
 */
{
	name: "Comfey Crest",
	spritenum: 0,
	itemUser: ["Comfey"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Comfey');
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Comfey') || !move.drain || !move.totalDamage || source.fainted) return;
		const healed = Math.round(move.totalDamage * move.drain[0] / move.drain[1]);
		for (const ally of source.adjacentAllies()) {
			if (ally.fainted || ally.hp >= ally.maxhp) continue;
			this.add('-activate', source, 'item: ' + this.effect.name);
			this.heal(Math.floor(healed / 2), ally, source);
		}
	},
	onTryHealPriority: 1,
	onTryHeal(damage, target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Comfey') || !['drain', 'strengthsap'].includes(effect.id)) return;
		const allies = target.adjacentAllies().filter(a => !a.fainted);
		if (!allies.length || allies.every(a => a.hp === a.maxhp)) return this.chainModify([5325, 4096]);
	},
	num: -3010,
	gen: 9,
}
