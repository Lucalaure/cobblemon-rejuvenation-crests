/*
 * Zoroark Crest (Pokemon Rejuvenation)
 * Grants the ability of the copied Pokémon to Zoroark. Additionally gives it STAB on that Pokémon's typing.
 */
{
	name: "Zoroark Crest",
	spritenum: 0,
	itemUser: ["Zoroark"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Zoroark');
	},
	/* Zoroark gains the ability and STAB of the Pokemon it is disguised as. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Zoroark') || !pokemon.illusion) return;
		const ability = this.dex.abilities.get(pokemon.illusion.ability);
		if (!ability.exists || ability.flags['notrace'] || ability.id === pokemon.ability) return;
		this.effectState.copied = ability.id;
		pokemon.addVolatile('ability:' + ability.id);
	},
	onModifyMove(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Zoroark') && pokemon.illusion && pokemon.illusion.getTypes().includes(move.type)) move.forceSTAB = true;
	},
	num: -2072,
	gen: 9,
}
