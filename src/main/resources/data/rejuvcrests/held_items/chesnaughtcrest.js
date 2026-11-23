/*
 * Chesnaught Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Spiky Shield raises its defenses by 50% for a turn, and it heals from foes hurt by the spikes.
 */
{
	name: "Chesnaught Crest",
	spritenum: 0,
	itemUser: ["Chesnaught"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Chesnaught');
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Chesnaught')) return;
		if (move.id === 'spikyshield') {
			this.effectState.shielded = true;
			this.add('-activate', source, 'item: ' + this.effect.name);
		}
	},
	onResidualOrder: 29,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Chesnaught')) return;
		if (!pokemon.lastMove || pokemon.lastMove.id !== 'spikyshield' || !pokemon.moveThisTurn) this.effectState.shielded = false;
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Chesnaught') && this.effectState.shielded) return this.chainModify(1.5);
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Chesnaught') && this.effectState.shielded) return this.chainModify(1.5);
	},
	onAnyDamage(damage, target, source, effect) {
		const holder = this.effectState.target;
		if ((holder.baseSpecies.baseSpecies === 'Chesnaught') && effect && effect.id === 'spikyshield' && source === holder && damage > 0) this.heal(damage, holder, holder);
	},
	num: -3008,
	gen: 9,
}
