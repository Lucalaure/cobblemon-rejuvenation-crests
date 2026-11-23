/*
 * Bastiodon Crest (Pokemon Rejuvenation)
 * Attackers take 50% of the damage they deal as recoil, and the wearer is healed the same amount.
 */
{
	name: "Bastiodon Crest",
	spritenum: 0,
	itemUser: ["Bastiodon"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Bastiodon');
	},
	onDamagingHitOrder: 2,
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Bastiodon') || source === target || !damage) return;
		this.add('-activate', target, 'item: ' + this.effect.name);
		this.damage(damage / 2, source, target);
		if (!target.fainted) this.heal(damage / 2, target, target);
	},
	num: -2003,
	gen: 9,
}
