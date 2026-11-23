/*
 * Seaking Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Makes it rain when Seaking enters battle. Attack +20%.
 */
{
	name: "Seaking Crest",
	spritenum: 0,
	itemUser: ["Seaking"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Seaking');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Seaking')) return this.chainModify(1.2);
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Seaking') || this.field.isWeather(['raindance', 'primordialsea'])) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.field.setWeather('raindance', pokemon);
	},
	num: -3036,
	gen: 9,
}
