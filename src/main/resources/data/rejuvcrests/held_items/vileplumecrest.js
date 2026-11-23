/*
 * Vileplume Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Damaging moves have a 30% chance to poison, burn or paralyze. Takes 20% less damage from statused foes.
 */
{
	name: "Vileplume Crest",
	spritenum: 0,
	itemUser: ["Vileplume"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Vileplume');
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Vileplume') || move.category === 'Status') return;
		if (target && !target.fainted && target !== source && this.randomChance(3, 10)) {
			const status = this.sample(['psn', 'brn', 'par']);
			target.trySetStatus(status, source, this.effect);
		}
	},
	onSourceModifyDamage(damage, source, target, move) {
		if ((target.baseSpecies.baseSpecies === 'Vileplume') && source.status) return this.chainModify(0.8);
	},
	num: -3045,
	gen: 9,
}
