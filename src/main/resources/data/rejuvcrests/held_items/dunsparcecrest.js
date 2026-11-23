/*
 * Dunsparce Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Moves with unlikely side effects hit harder; moves with likely side effects make it take less damage. Restores 1/16 HP each turn.
 */
{
	name: "Dunsparce Crest",
	spritenum: 0,
	itemUser: ["Dunsparce", "Dudunsparce"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Dunsparce' || pokemon.baseSpecies.baseSpecies === 'Dudunsparce');
	},
	/* chance = the side-effect chance of the move it is using this turn (Serene Grace doubles it). */
	dunsChance(pokemon, move) {
		if (!move) return null;
		const sec = move.secondaries && move.secondaries[0] || move.secondary;
		if (!sec || !sec.chance) return 0;
		return Math.min(100, sec.chance * (pokemon.hasAbility('serenegrace') ? 2 : 1));
	},
	dunsScale(pokemon) {
		return pokemon.baseSpecies.baseSpecies === 'Dudunsparce' ? 0.8 : 1;
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Dunsparce' || pokemon.baseSpecies.baseSpecies === 'Dudunsparce')) return;
		const chance = this.effect.dunsChance(pokemon, move);
		if (!chance || chance >= 100) return;
		return this.chainModify(1 + ((100 - chance) / 2) * 0.01 * this.effect.dunsScale(pokemon));
	},
	onSourceModifyDamage(damage, source, target, move) {
		if (!(target.baseSpecies.baseSpecies === 'Dunsparce' || target.baseSpecies.baseSpecies === 'Dudunsparce')) return;
		const action = this.queue.willMove(target);
		const own = action && action.move || (target.lastMove && this.dex.moves.get(target.lastMove.id));
		const chance = this.effect.dunsChance(target, own);
		if (!chance) return;
		return this.chainModify(Math.max(0.5, 1 - chance * 0.005 * this.effect.dunsScale(target)));
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dunsparce' || pokemon.baseSpecies.baseSpecies === 'Dudunsparce')) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -3014,
	gen: 9,
}
