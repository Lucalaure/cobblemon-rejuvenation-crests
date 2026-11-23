/*
 * Delibird Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Foes fall asleep when Delibird switches in. Present becomes a 90-power Ice move that hits the weaker defense and raises all of Delibird's stats by 20%.
 */
{
	name: "Delibird Crest",
	spritenum: 0,
	itemUser: ["Delibird"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Delibird');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delibird')) return;
		this.effectState.presentMult = 1;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		for (const foe of pokemon.adjacentFoes()) foe.trySetStatus('slp', pokemon, this.effect);
	},
	onModifyMove(move, pokemon, target) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Delibird') || move.id !== 'present') return;
		move.type = 'Ice';
		move.basePower = 90;
		delete move.basePowerCallback;
		move.onModifyMove = undefined;
		if (target) {
			const usePhysical = target.getStat('def') < target.getStat('spd');
			move.category = usePhysical ? 'Physical' : 'Special';
		}
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Delibird') || move.id !== 'present') return;
		this.effectState.presentMult = (this.effectState.presentMult || 1) * 1.2;
		this.add('-activate', source, 'item: ' + this.effect.name);
	},
	onModifyAtkPriority: 2,
	onModifyAtk(v, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delibird') && this.effectState.presentMult > 1) return this.chainModify(this.effectState.presentMult);
	},
	onModifyDefPriority: 2,
	onModifyDef(v, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delibird') && this.effectState.presentMult > 1) return this.chainModify(this.effectState.presentMult);
	},
	onModifySpAPriority: 2,
	onModifySpA(v, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delibird') && this.effectState.presentMult > 1) return this.chainModify(this.effectState.presentMult);
	},
	onModifySpDPriority: 2,
	onModifySpD(v, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delibird') && this.effectState.presentMult > 1) return this.chainModify(this.effectState.presentMult);
	},
	onModifySpePriority: 2,
	onModifySpe(v, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Delibird') && this.effectState.presentMult > 1) return this.chainModify(this.effectState.presentMult);
	},
	num: -3011,
	gen: 9,
}
