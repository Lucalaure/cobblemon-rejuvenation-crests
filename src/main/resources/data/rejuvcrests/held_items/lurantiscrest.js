/*
 * Lurantis Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Against a foe with a type that's super effective on it, gains +1 priority and 50% more damage.
 */
{
	name: "Lurantis Crest",
	spritenum: 0,
	itemUser: ["Lurantis"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Lurantis');
	},
	disadvantaged(battle, pokemon) {
		return pokemon.adjacentFoes().some(foe => foe.getTypes().some(t => pokemon.runImmunity(t) && battle.dex.getEffectiveness(t, pokemon) > 0));
	},
	onModifyPriority(priority, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Lurantis') && move.category !== 'Status' && this.effect.disadvantaged(this, pokemon)) return priority + 1;
	},
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Lurantis') && this.effect.disadvantaged(this, source)) return this.chainModify(1.5);
	},
	num: -3025,
	gen: 9,
}
