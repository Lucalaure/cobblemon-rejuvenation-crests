/*
 * Dustox Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Defense and Sp. Def +30%. Poisons attackers, or lowers poisoned attackers' stats. Restores 1/16 HP each turn.
 */
{
	name: "Dustox Crest",
	spritenum: 0,
	itemUser: ["Dustox"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Dustox');
	},
	onModifyDefPriority: 1,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dustox')) return this.chainModify(1.3);
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dustox')) return this.chainModify(1.3);
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Dustox') || source === target) return;
		this.add('-activate', target, 'item: ' + this.effect.name);
		if (['psn', 'tox'].includes(source.status)) {
			for (const foe of target.adjacentFoes()) {
				if (['psn', 'tox'].includes(foe.status)) this.boost({atk: -1, spa: -1, spe: -1}, foe, target);
			}
		} else {
			source.trySetStatus('psn', target, this.effect);
		}
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Dustox')) this.heal(pokemon.baseMaxhp / 16);
	},
	num: -3015,
	gen: 9,
}
