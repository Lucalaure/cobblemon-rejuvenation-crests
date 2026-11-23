/*
 * Rampardos Crest (Pokemon Rejuvenation)
 * Rampardos will hang on with 1HP regardless of HP once per battle and does not take recoil.
 */
{
	name: "Rampardos Crest",
	spritenum: 0,
	itemUser: ["Rampardos"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Rampardos');
	},
	onDamagePriority: -30,
	onDamage(damage, target, source, effect) {
		if (!(target.baseSpecies.baseSpecies === 'Rampardos')) return;
		if (effect.id === 'recoil') {
			if (!this.activeMove) return;
			if (this.activeMove.id !== 'struggle') return null;
		}
		if (effect.effectType === 'Move' && damage >= target.hp && target.hp > 1 && !target.m.rampardosCrestUsed) {
			target.m.rampardosCrestUsed = true;
			this.add('-activate', target, 'move: Endure');
			return target.hp - 1;
		}
	},
	num: -2045,
	gen: 9,
}
