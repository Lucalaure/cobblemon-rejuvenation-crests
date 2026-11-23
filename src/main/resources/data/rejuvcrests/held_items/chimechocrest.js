/*
 * Chimecho Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Defense and Sp. Def +50%. Rings a Heal Bell every turn, curing and healing its whole party.
 */
{
	name: "Chimecho Crest",
	spritenum: 0,
	itemUser: ["Chimecho"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Chimecho');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Chimecho')) return this.chainModify(1.5);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Chimecho')) return this.chainModify(1.5);
	},
	onResidualOrder: 28,
	onResidual(pokemon) {
		/* A Heal Bell every turn: cures and heals the whole party (1/16, or 1/8 if it had a status). */
		if (!(pokemon.baseSpecies.baseSpecies === 'Chimecho')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		for (const ally of pokemon.side.pokemon) {
			if (ally.fainted || ally.hp <= 0) continue;
			const amount = Math.floor(ally.baseMaxhp / (ally.status ? 8 : 16));
			if (ally.isActive) {
				this.heal(amount, ally, pokemon);
				ally.cureStatus();
			} else {
				ally.sethp(Math.min(ally.maxhp, ally.hp + amount));
				ally.setStatus('');
			}
		}
	},
	num: -3009,
	gen: 9,
}
