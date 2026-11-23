/*
 * Probopass Crest (Pokemon Rejuvenation)
 * Probopass levitates, and Mini-noses do 3-hit 20BP type-based damage after a damaging move.
 */
{
	name: "Probopass Crest",
	spritenum: 0,
	itemUser: ["Probopass"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Probopass');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Probopass')) return;
		if (pokemon.addVolatile('magnetrise')) this.add('-activate', pokemon, 'item: ' + this.effect.name);
	},
	onResidualOrder: 5,
	onResidual(pokemon) {
		/* Keep levitating for as long as the crest is held. */
		if ((pokemon.baseSpecies.baseSpecies === 'Probopass') && pokemon.volatiles['magnetrise']) pokemon.volatiles['magnetrise'].duration = 5;
	},
	onAfterMoveSecondarySelf(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Probopass') || move.category === 'Status' || move.rejuvNoses || !target || target === source || target.fainted) return;
		const nose = this.dex.getActiveMove('bulletseed');
		nose.rejuvNoses = true;
		nose.category = 'Special';
		nose.basePower = 20;
		nose.multihit = 3;
		nose.flags = {protect: 1, mirror: 1};
		let best = 'Steel';
		let bestEff = -Infinity;
		for (const type of ['Steel', 'Rock', 'Electric']) {
			if (!target.runImmunity(type)) continue;
			const eff = target.runEffectiveness({...nose, type});
			if (eff > bestEff) { best = type; bestEff = eff; }
		}
		nose.type = best;
		this.add('-activate', source, 'item: ' + this.effect.name);
		this.actions.useMove(nose, source, target);
	},
	num: -2043,
	gen: 9,
}
