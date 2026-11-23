/*
 * Claydol Crest (Pokemon Rejuvenation)
 * Claydol's Special attacks use its Defense stat. The power of beam moves is increased by 50%.
 */
{
	name: "Claydol Crest",
	spritenum: 0,
	itemUser: ["Claydol"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Claydol');
	},
	onModifyMove(move, pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Claydol')) return;
		if (move.category === 'Special' && !move.overrideOffensiveStat) move.overrideOffensiveStat = 'def';
		if (['hyperbeam', 'prismaticlaser', 'eternabeam'].includes(move.id) && move.self) {
			move.self = {...move.self};
			delete move.self.volatileStatus;
		}
	},
	onBasePowerPriority: 19,
	onBasePower(basePower, pokemon, target, move) {
		if ((pokemon.baseSpecies.baseSpecies === 'Claydol') && ['signalbeam', 'chargebeam', 'solarbeam', 'icebeam', 'aurorabeam', 'hyperbeam', 'psybeam', 'flashcannon', 'bubblebeam', 'fleurcannon', 'moongeistbeam', 'dynamaxcannon', 'eternabeam', 'steelbeam', 'meteorbeam', 'prismaticlaser'].includes(move.id)) return this.chainModify(1.5);
	},
	onChargeMove(pokemon, target, move) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Claydol') || !['solarbeam', 'meteorbeam'].includes(move.id)) return;
		this.attrLastMove('[still]');
		this.addMove('-anim', pokemon, move.name, target);
		return false;
	},
	num: -2010,
	gen: 9,
}
