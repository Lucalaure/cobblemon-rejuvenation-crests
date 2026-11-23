/*
 * Pachirisu Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Its defenses rise the lower its offenses are. Attacks deal extra damage equal to 10% of its defense, healing if the target is paralyzed.
 */
{
	name: "Pachirisu Crest",
	spritenum: 0,
	itemUser: ["Pachirisu"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Pachirisu');
	},
	onModifyDefPriority: 2,
	onModifyDef(def, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Pachirisu')) return Math.max(1, Math.floor(def * (2 * pokemon.storedStats.def - pokemon.storedStats.atk) / pokemon.storedStats.def));
	},
	onModifySpDPriority: 2,
	onModifySpD(spd, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Pachirisu')) return Math.max(1, Math.floor(spd * (2 * pokemon.storedStats.spd - pokemon.storedStats.spa) / pokemon.storedStats.spd));
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Pachirisu') || move.category === 'Status' || !move.totalDamage || !target || target.fainted || target.isAlly(source)) return;
		const amount = Math.max(1, Math.floor(source.getStat(move.category === 'Physical' ? 'def' : 'spd') / 10));
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.damage(amount, target, source);
		if (target.status === 'par') this.heal(amount, source, source);
	},
	num: -3032,
	gen: 9,
}
