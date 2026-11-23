/*
 * Aurorus Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Sets a 3-turn Aurora Veil on entry. Attackers get frostbite: they take Ice damage each turn and their contact moves turn Ice-type.
 */
{
	name: "Aurorus Crest",
	spritenum: 0,
	itemUser: ["Aurorus"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Aurorus');
	},
	onStart(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Aurorus')) return;
		if (pokemon.side.addSideCondition('auroraveil', pokemon)) {
			pokemon.side.sideConditions['auroraveil'].duration = 3;
			this.add('-activate', pokemon, 'item: ' + this.effect.name);
		}
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Aurorus') || source === target || source.volatiles['rejuvcrestfrostbite']) return;
		const Cond = this.dex.conditions.get('confusion').constructor;
		this.add('-activate', target, 'item: ' + this.effect.name);
		source.addVolatile(new Cond({
			name: 'rejuvcrestfrostbite',
			noCopy: true,
			onStart(p) { this.add('-message', p.name + ' got frostbite!'); },
			onModifyTypePriority: -3,
			onModifyType(move, p) { if (move.flags['contact'] && move.category !== 'Status') move.type = 'Ice'; },
			onResidualOrder: 9,
			onResidual(p) {
				if (p.hasType('Fire')) return;
				const eff = Math.pow(2, this.dex.getEffectiveness('Ice', p));
				this.add('-message', p.name + ' is hurt by its frostbite!');
				this.damage(p.baseMaxhp * eff / 16, p);
			},
		}), target);
	},
	num: -3001,
	gen: 9,
}
