/*
 * Lanturn Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * On switch-in, spotlights a foe and lowers its Attack and Sp. Atk by 20%, adding the same amount to Lanturn's defenses. Restores 1/16 HP each turn.
 */
{
	name: "Lanturn Crest",
	spritenum: 0,
	itemUser: ["Lanturn"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Lanturn');
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		const bonus = (pokemon.baseSpecies.baseSpecies === 'Lanturn') && this.effectState.defBonus;
		if (bonus) return Math.max(1, Math.floor(def * (pokemon.storedStats.def + bonus) / pokemon.storedStats.def));
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		const bonus = (pokemon.baseSpecies.baseSpecies === 'Lanturn') && this.effectState.spdBonus;
		if (bonus) return Math.max(1, Math.floor(spd * (pokemon.storedStats.spd + bonus) / pokemon.storedStats.spd));
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Lanturn')) return;
		this.effectState.defBonus = 0;
		this.effectState.spdBonus = 0;
		const target = pokemon.adjacentFoes()[0];
		if (!target) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.add('-message', pokemon.name + ' puts a target on ' + target.name + '!');
		target.addVolatile('spotlight');
		const amount = Math.floor((target.getStat('atk', true, true) + target.getStat('spa', true, true)) / 2 * 0.2);
		this.effectState.defBonus = amount;
		this.effectState.spdBonus = amount;
		const Cond = this.dex.conditions.get('confusion').constructor;
		if (!target.volatiles['rejuvcrestspotlight']) {
			target.addVolatile(new Cond({
				name: 'rejuvcrestspotlight',
				noCopy: true,
				onModifyAtkPriority: 3,
				onModifyAtk() { return this.chainModify(0.8); },
				onModifySpAPriority: 3,
				onModifySpA() { return this.chainModify(0.8); },
			}));
		}
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Lanturn')) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -3023,
	gen: 9,
}
