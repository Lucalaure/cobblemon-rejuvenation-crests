/*
 * Girafarig Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Girafarig attacks twice, the second hit with the inverse type. Farigiraf's attacks gain the inverse type as a second type when it helps.
 */
{
	name: "Girafarig Crest",
	spritenum: 0,
	itemUser: ["Girafarig", "Farigiraf"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Girafarig' || pokemon.baseSpecies.baseSpecies === 'Farigiraf');
	},
	inverse: {Normal: 'Ghost', Ghost: 'Normal', Fighting: 'Psychic', Psychic: 'Fighting', Fairy: 'Dark', Dark: 'Fairy', Ground: 'Flying', Flying: 'Ground', Water: 'Fire', Fire: 'Water', Electric: 'Grass', Grass: 'Electric', Dragon: 'Bug', Bug: 'Dragon', Ice: 'Steel', Steel: 'Ice', Rock: 'Poison', Poison: 'Rock'},
	/* Girafarig: a second hit with the inverse type, both hits at 2/3 power. */
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Girafarig' || source.baseSpecies.baseSpecies === 'Farigiraf') && source.baseSpecies.baseSpecies === 'Girafarig') return this.chainModify([2731, 4096]);
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Girafarig' || source.baseSpecies.baseSpecies === 'Farigiraf') || source.baseSpecies.baseSpecies !== 'Girafarig' || move.category === 'Status' || move.rejuvGiraf) return;
		if (!target || target.fainted || source.fainted) return;
		const again = this.dex.getActiveMove(move.id);
		again.rejuvGiraf = true;
		again.type = this.effect.inverse[move.type] || move.type;
		again.onModifyType = undefined;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.actions.useMove(again, source, target);
	},
	onModifyTypePriority: -2,
	onModifyType(move, pokemon) {
		if (move.rejuvGiraf) move.type = this.effect.inverse[this.dex.moves.get(move.id).type] || move.type;
	},
	/* Farigiraf: attacks gain the inverse type as a second type if the target doesn't resist it. */
	onModifyMove(move, pokemon, target) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Girafarig' || pokemon.baseSpecies.baseSpecies === 'Farigiraf') || pokemon.baseSpecies.baseSpecies !== 'Farigiraf' || move.category === 'Status' || !target) return;
		const extra = this.effect.inverse[move.type];
		if (!extra || !target.runImmunity(extra) || this.dex.getEffectiveness(extra, target) < 0) return;
		const previous = move.onEffectiveness;
		move.onEffectiveness = function (typeMod, t, type, m) {
			const base = previous ? (previous.call(this, typeMod, t, type, m) ?? typeMod) : typeMod;
			return base + this.dex.getEffectiveness(extra, type);
		};
	},
	num: -3019,
	gen: 9,
}
