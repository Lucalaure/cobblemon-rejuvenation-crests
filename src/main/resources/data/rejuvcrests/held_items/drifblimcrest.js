/*
 * Drifblim Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Burns itself on entry and heals while burned. Immune to Fire-type moves.
 */
{
	name: "Drifblim Crest",
	spritenum: 0,
	itemUser: ["Drifblim"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Drifblim');
	},
	onStart(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Drifblim') && !pokemon.status) pokemon.trySetStatus('brn', pokemon, this.effect);
	},
	onDamagePriority: 1,
	onDamage(damage, target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Drifblim') && effect && effect.id === 'brn') {
			this.heal(target.baseMaxhp / 8);
			return false;
		}
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target !== source && (target.baseSpecies.baseSpecies === 'Drifblim') && move.type === 'Fire') {
			if (!this.heal(target.baseMaxhp / 4)) this.add('-immune', target, '[from] item: ' + this.effect.name);
			return null;
		}
	},
	num: -3013,
	gen: 9,
}
