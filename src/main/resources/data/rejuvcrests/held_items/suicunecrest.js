/*
 * Suicune Crest (Pokemon Rejuvenation)
 * Holder ignores the negative effects of status conditions and sets a 1 Turn Tailwind on entry.
 */
{
	name: "Suicune Crest",
	spritenum: 0,
	itemUser: ["Suicune"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Suicune');
	},
	/* Status conditions lose their downsides: no damage, no Attack/Speed drop, and it can act through them. */
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Suicune')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		const side = pokemon.side;
		if (side.sideConditions['tailwind']) {
			side.sideConditions['tailwind'].duration += 1;
		} else if (side.addSideCondition('tailwind', pokemon)) {
			side.sideConditions['tailwind'].duration = 1;
		}
	},
	onDamagePriority: 2,
	onDamage(damage, target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Suicune') && effect && ['brn', 'psn', 'tox', 'frz'].includes(effect.id)) return false;
	},
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Suicune') && source.status === 'brn' && move.category === 'Physical' && move.id !== 'facade' && !source.hasAbility('guts')) return this.chainModify(2);
	},
	onModifySpePriority: -102,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Suicune') && pokemon.status === 'par' && !pokemon.hasAbility('quickfeet')) return spe * 2;
	},
	onBeforeMovePriority: 20,
	onBeforeMove(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Suicune') || !['par', 'slp', 'frz'].includes(pokemon.status)) return;
		/* Hide the status from its own before-move check, then restore it once the move is done. */
		this.effectState.hiddenStatus = pokemon.status;
		pokemon.status = '';
	},
	onAfterMove(pokemon) {
		if (this.effectState.hiddenStatus && !pokemon.status) pokemon.status = this.effectState.hiddenStatus;
		this.effectState.hiddenStatus = undefined;
	},
	onMoveAborted(pokemon) {
		if (this.effectState.hiddenStatus && !pokemon.status) pokemon.status = this.effectState.hiddenStatus;
		this.effectState.hiddenStatus = undefined;
	},
	onResidualOrder: 5,
	onResidualSubOrder: 4,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Suicune')) return;
		this.heal(pokemon.baseMaxhp / 16);
	},
	num: -2060,
	gen: 9,
}
