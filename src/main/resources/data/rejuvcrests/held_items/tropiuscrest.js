/*
 * Tropius Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Moves of 60 power or less are 50% stronger. Grows a berry that cures status, softens a hit at full HP, or heals and raises a stat.
 */
{
	name: "Tropius Crest",
	spritenum: 0,
	itemUser: ["Tropius"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Tropius');
	},
	onBasePowerPriority: 30,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Tropius') && move.basePower > 0 && move.basePower <= 60) return this.chainModify(1.5);
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Tropius')) return;
		this.effectState.berry = 2;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.add('-message', pokemon.name + "'s crest gave it a berry!");
	},
	onSourceModifyDamage(damage, source, target, move) {
		if (!(target.baseSpecies.baseSpecies === 'Tropius') || target.hp !== target.maxhp || this.effectState.berry !== 2) return;
		this.effectState.berry = 0;
		this.add('-activate', target, 'item: ' + this.effect.name);
		return this.chainModify(0.7);
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Tropius')) return;
		const state = this.effectState;
		if (state.berry === undefined) state.berry = 2;
		if (state.berry === 2 && pokemon.status) {
			state.berry = 0;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			pokemon.cureStatus();
		} else if (state.berry === 2 && pokemon.hp < pokemon.maxhp) {
			state.berry = 0;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
			this.heal(pokemon.baseMaxhp / 8);
			const first = pokemon.moveSlots[0] && this.dex.moves.get(pokemon.moveSlots[0].id);
			const [a, b] = !first || first.category === 'Status' ? ['def', 'spd'] : first.category === 'Physical' ? ['def', 'atk'] : ['spd', 'spa'];
			this.boost({[pokemon.boosts[a] <= pokemon.boosts[b] ? a : b]: 1}, pokemon, pokemon);
		} else if (state.berry < 2) {
			const sunny = ['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather());
			state.berry += 1;
			if (pokemon.hasAbility('harvest')) state.berry += sunny ? 1 : this.random(2);
			if (state.berry >= 2) {
				state.berry = 2;
				this.add('-message', pokemon.name + "'s berry regrew!");
			}
		}
	},
	num: -3040,
	gen: 9,
}
