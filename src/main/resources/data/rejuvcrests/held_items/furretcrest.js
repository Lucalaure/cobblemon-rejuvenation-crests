/*
 * Furret Crest (Pokemon Rejuvenation)
 * Upon switching in, Furret loses 25% of its Max HP to create a substitute.
 */
{
	name: "Furret Crest",
	spritenum: 0,
	itemUser: ["Furret"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Furret');
	},
	/* Male: substitute on entry (Rejuvenation). Female: Attack and Sp. Atk copy Speed, physical Normal moves become Ground (Crest Emporium). */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Furret') || pokemon.gender === 'F' || pokemon.volatiles['substitute']) return;
		if (pokemon.hp <= pokemon.maxhp / 4 || pokemon.maxhp === 1) {
			this.add('-fail', pokemon, 'move: Substitute', '[weak]');
			return;
		}
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.directDamage(pokemon.maxhp / 4, pokemon);
		pokemon.addVolatile('substitute');
	},
	onModifyAtkPriority: 1,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Furret') && pokemon.gender === 'F') return Math.floor(atk * pokemon.storedStats.spe / pokemon.storedStats.atk);
	},
	onModifySpAPriority: 1,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Furret') && pokemon.gender === 'F') return Math.floor(spa * pokemon.storedStats.spe / pokemon.storedStats.spa);
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Furret') && pokemon.gender === 'F' && move.type === 'Normal' && move.category === 'Physical') move.type = 'Ground';
	},
	num: -2024,
	gen: 9,
}
