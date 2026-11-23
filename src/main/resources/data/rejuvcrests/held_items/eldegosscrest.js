/*
 * Eldegoss Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Raises Defense every turn, gaining more effects the higher it gets. When hit, loses its Defense boosts to punish the attacker.
 */
{
	name: "Eldegoss Crest",
	spritenum: 0,
	itemUser: ["Eldegoss"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Eldegoss');
	},
	onResidualOrder: 28,
	onResidual(pokemon) {
		if (!(pokemon.baseSpecies.baseSpecies === 'Eldegoss')) return;
		this.add('-activate', pokemon, 'item: ' + this.effect.name);
		this.boost({def: pokemon.hasAbility('cottondown') ? 2 : 1}, pokemon, pokemon);
		if (pokemon.boosts.def > 3) this.heal(pokemon.baseMaxhp / 16);
		if (pokemon.boosts.def > 4 && pokemon.status) pokemon.cureStatus();
		if (pokemon.boosts.def > 5) this.boost({atk: 1, spa: 1}, pokemon, pokemon);
	},
	onSetStatus(status, target, source, effect) {
		if ((target.baseSpecies.baseSpecies === 'Eldegoss') && target.boosts.def > 4) {
			if (effect && effect.status) this.add('-immune', target, '[from] item: ' + this.effect.name);
			return false;
		}
	},
	onCriticalHit(target) {
		if ((target.baseSpecies.baseSpecies === 'Eldegoss') && target.boosts.def > 2) return false;
	},
	onDamagingHit(damage, target, source, move) {
		if (!(target.baseSpecies.baseSpecies === 'Eldegoss') || source === target || target.boosts.def <= 2) return;
		const def = target.boosts.def;
		this.add('-activate', target, 'item: ' + this.effect.name);
		this.boost({evasion: -1}, source, target);
		if (def > 3 && !source.hasType('Grass')) source.addVolatile('leechseed', target);
		if (def > 4) source.trySetStatus(this.sample(['par', 'psn']), target, this.effect);
		if (def > 5) this.boost({atk: -1, spa: -1}, source, target);
		this.boost({def: -(def + (target.hasAbility('cottondown') ? 2 : 1))}, target, target);
	},
	num: -3016,
	gen: 9,
}
