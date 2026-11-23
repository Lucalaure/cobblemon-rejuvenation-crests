/*
 * Zangoose Crest (Pokemon Rejuvenation)
 * Zangoose becomes poisoned upon switching in, and restores HP while poisoned.
 */
{
	name: "Zangoose Crest",
	spritenum: 0,
	itemUser: ["Zangoose"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Zangoose');
	},
	onStart(pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Zangoose') && !pokemon.status) pokemon.trySetStatus('psn', pokemon, this.effect);
	},
	onDamagePriority: 1,
	onDamage(damage, target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Zangoose') && effect && (effect.id === 'psn' || effect.id === 'tox')) {
			this.heal(target.baseMaxhp / 8);
			return false;
		}
	},
	num: -2069,
	gen: 9,
}
