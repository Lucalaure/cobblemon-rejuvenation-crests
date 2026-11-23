/*
 * Cherrim Crest (Pokemon Rejuvenation)
 * Activates Flower Gift regardless of weather. Flower Gift additionally boosts Defense and SpAtk.
 */
{
	name: "Cherrim Crest",
	spritenum: 0,
	itemUser: ["Cherrim"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Cherrim');
	},
	/* Flower Gift works without sun and also boosts Defense and Sp. Atk. */
	onAllyModifyAtkPriority: 3,
	onAllyModifyAtk(atk, pokemon) {
		const holder = this.effectState.target;
		if ((holder.baseSpecies.baseSpecies === 'Cherrim') && holder.hasAbility('flowergift') && !['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(1.5);
	},
	onAllyModifySpDPriority: 4,
	onAllyModifySpD(spd, pokemon) {
		const holder = this.effectState.target;
		if ((holder.baseSpecies.baseSpecies === 'Cherrim') && holder.hasAbility('flowergift') && !['sunnyday', 'desolateland'].includes(pokemon.effectiveWeather())) return this.chainModify(1.5);
	},
	onAllyModifyDef(def, pokemon) {
		const holder = this.effectState.target;
		if ((holder.baseSpecies.baseSpecies === 'Cherrim') && holder.hasAbility('flowergift')) return this.chainModify(1.5);
	},
	onAllyModifySpA(spa, pokemon) {
		const holder = this.effectState.target;
		if ((holder.baseSpecies.baseSpecies === 'Cherrim') && holder.hasAbility('flowergift')) return this.chainModify(1.5);
	},
	num: -2008,
	gen: 9,
}
