/*
 * Qwilfish Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Qwilfish: Aqua Ring on entry, Rough Skin, Sp. Def +20%. Overqwil: contact attackers are hurt and it saps their HP, more if they're poisoned.
 */
{
	name: "Qwilfish Crest",
	spritenum: 0,
	itemUser: ["Qwilfish", "Overqwil"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !((pokemon.baseSpecies.baseSpecies === 'Qwilfish' && !pokemon.baseSpecies.forme) || pokemon.baseSpecies.baseSpecies === 'Overqwil');
	},
	onStart(pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Qwilfish' && !pokemon.baseSpecies.forme) || pokemon.baseSpecies.baseSpecies === 'Overqwil') && pokemon.baseSpecies.baseSpecies === 'Qwilfish') pokemon.addVolatile('aquaring');
	},
	onModifySpDPriority: 1,
	onModifySpD(spd, pokemon) {
		if (((pokemon.baseSpecies.baseSpecies === 'Qwilfish' && !pokemon.baseSpecies.forme) || pokemon.baseSpecies.baseSpecies === 'Overqwil') && pokemon.baseSpecies.baseSpecies === 'Qwilfish') return this.chainModify(1.2);
	},
	onDamagingHitOrder: 1,
	onDamagingHit(damage, target, source, move) {
		if (!((target.baseSpecies.baseSpecies === 'Qwilfish' && !target.baseSpecies.forme) || target.baseSpecies.baseSpecies === 'Overqwil') || source === target || !this.checkMoveMakesContact(move, source, target, true)) return;
		this.damage(source.baseMaxhp / 8, source, target);
		if (target.baseSpecies.baseSpecies === 'Overqwil' && !target.fainted) {
			this.heal(source.baseMaxhp / 8 * (['psn', 'tox'].includes(source.status) ? 1.2 : 1), target, target);
		}
	},
	num: -3035,
	gen: 9,
}
