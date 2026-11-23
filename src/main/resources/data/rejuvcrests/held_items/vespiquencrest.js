/*
 * Vespiquen Crest (Pokemon Rejuvenation)
 * Attack Order and Defend Order grant a 50% boost to Offenses or Defenses, switching around when the other is used.
 */
{
	name: "Vespiquen Crest",
	spritenum: 0,
	itemUser: ["Vespiquen"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Vespiquen');
	},
	/* Starts in Attack Stance (+1 Atk/Sp. Atk). Status moves switch to Defense Stance, attacks switch back. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Vespiquen')) return;
		this.effectState.attackStance = true;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.boost({atk: 1, spa: 1}, pokemon, pokemon);
	},
	onBeforeMovePriority: 0.5,
	onBeforeMove(pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Vespiquen')) return;
		const attack = this.effectState.attackStance !== false;
		if (move.category === 'Status' && attack) {
			this.effectState.attackStance = false;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			this.boost({atk: -1, spa: -1, def: 1, spd: 1}, pokemon, pokemon);
		} else if (move.category !== 'Status' && !attack) {
			this.effectState.attackStance = true;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			this.boost({def: -1, spd: -1, atk: 1, spa: 1}, pokemon, pokemon);
		}
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Vespiquen') && this.effectState.attackStance === false) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2069,
	gen: 9,
}
