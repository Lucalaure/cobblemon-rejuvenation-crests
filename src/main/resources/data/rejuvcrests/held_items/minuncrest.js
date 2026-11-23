/*
 * Minun Crest (Pokemon Rejuvenation)
 * Activates Minus. Weakens the power of physical moves targetting the user and its partner by 33%.
 */
{
	name: "Minun Crest",
	spritenum: 0,
	itemUser: ["Minun"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Minun');
	},
	onModifySpAPriority: 5,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Minun') && pokemon.hasAbility(['plus', 'minus'])) return this.chainModify(1.5);
	},
	onAnyModifyDamage(damage, source, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Minun') || holder.gender === 'F' || !target || move.category !== 'Physical' || source.isAlly(holder)) return;
		if (target === holder || target.isAlly(holder)) return this.chainModify([2731, 4096]);
	},
	/* Female (Crest Emporium): above 50% HP its partner helps out: it takes half damage and follows each move */
	/* with the move two slots away (once per turn). */
	onSourceModifyDamage(damage, source, target, move) {
		if ((target.baseSpecies.baseSpecies === 'Minun') && target.gender === 'F' && target.hp > target.maxhp / 2) return this.chainModify(0.5);
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Minun') || source.gender !== 'F' || source.hp <= source.maxhp / 2 || move.isExternal || move.rejuvHelper) return;
		if (this.effectState.helpedTurn === this.turn) return;
		const slot = source.moveSlots.findIndex(s => s.id === move.id);
		if (slot < 0) return;
		const other = source.moveSlots[slot < 2 ? slot + 2 : slot - 2];
		const foe = source.adjacentFoes()[0];
		if (!other || !foe) return;
		this.effectState.helpedTurn = this.turn;
		const m = this.dex.getActiveMove(other.id);
		m.rejuvHelper = true;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.actions.useMove(m, source, foe);
	},
	num: -2037,
	gen: 9,
}
