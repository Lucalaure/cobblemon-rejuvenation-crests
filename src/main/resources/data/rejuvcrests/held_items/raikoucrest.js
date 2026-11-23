/*
 * Raikou Crest (Pokemon Rejuvenation)
 * Holder's and any possible partners' moves act as if Rain and Electric Terrain are present.
 */
{
	name: "Raikou Crest",
	spritenum: 0,
	itemUser: ["Raikou"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Raikou');
	},
	/* Raikou and its partners act as if rain and Electric Terrain are active. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Raikou') || this.field.isTerrain('electricterrain')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.field.setTerrain('electricterrain', pokemon);
	},
	onAllyBasePowerPriority: 19,
	onAllyBasePower(basePower, attacker, defender, move) {
		if (!(this.effectState.target.baseSpecies.baseSpecies === 'Raikou')) return;
		let mod = 1;
		if (!['raindance', 'primordialsea'].includes(attacker.effectiveWeather())) {
			if (move.type === 'Water') mod *= 1.5;
			if (move.type === 'Fire') mod *= 0.5;
		}
		if (move.type === 'Electric' && !this.field.isTerrain('electricterrain') && attacker.isGrounded()) mod *= 1.3;
		if (mod !== 1) return this.chainModify(mod);
	},
	onAllyModifyMove(move, pokemon) {
		if ((this.effectState.target.baseSpecies.baseSpecies === 'Raikou') && ['thunder', 'hurricane', 'bleakwindstorm', 'wildboltstorm', 'sandsearstorm'].includes(move.id)) move.accuracy = true;
	},
	num: -2044,
	gen: 9,
}
