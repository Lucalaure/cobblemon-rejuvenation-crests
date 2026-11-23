/*
 * Sigilyph Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Every 2 turns it gives itself a status condition, then passes it to a healthy foe.
 */
{
	name: "Sigilyph Crest",
	spritenum: 0,
	itemUser: ["Sigilyph"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Sigilyph');
	},
	onResidualOrder: 29,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Sigilyph') || pokemon.activeTurns < 2 || pokemon.activeTurns % 2 !== 0) return;
		const foes = pokemon.adjacentFoes();
		const foe = foes.find(f => !f.status) || foes[0];
		if (!foe) return;
		if (!pokemon.status) {
			let status = foe.getStat('atk') >= foe.getStat('spa') ? 'brn' : 'par';
			if (pokemon.getStat('spe') * 1.25 <= foe.getStat('spe') || foe.getStat('spa') > foe.getStat('atk')) status = 'par';
			if (this.randomChance(2, 10) && foe.status !== 'slp') status = 'slp';
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			pokemon.setStatus(status, pokemon, this.effect);
		}
		if (pokemon.status && !foe.status) {
			const status = pokemon.status;
			if (foe.trySetStatus(status, pokemon, this.dex.moves.get('psychoshift'))) {
				this.add('-activate', pokemon, 'move: Psycho Shift');
				pokemon.cureStatus();
			}
		}
	},
	num: -3037,
	gen: 9,
}
