/*
 * Emolga Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Rides wind moves back at the attacker as Electric moves. Uses Discharge when its side uses Tailwind. Offenses grow with its Speed.
 */
{
	name: "Emolga Crest",
	spritenum: 0,
	itemUser: ["Emolga"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Emolga');
	},
	emolgaBonus(battle, pokemon) {
		let speed = pokemon.storedStats.spe * (pokemon.side.sideConditions['tailwind'] ? 2 : 1);
		if (pokemon.boosts.spe > 0) speed *= pokemon.boosts.spe * 1.5;
		return speed * 0.125;
	},
	onModifyAtkPriority: 2,
	onModifyAtk(atk, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Emolga')) return Math.floor(atk * (pokemon.storedStats.atk + this.effect.emolgaBonus(this, pokemon)) / pokemon.storedStats.atk);
	},
	onModifySpAPriority: 2,
	onModifySpA(spa, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Emolga')) return Math.floor(spa * (pokemon.storedStats.spa + this.effect.emolgaBonus(this, pokemon)) / pokemon.storedStats.spa);
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Emolga') || !move.flags['wind'] || move.rejuvRidden) return;
		this.add('-immune', target, '[from] item: ' + this.effect.name);
		this.add('-message', target.name + ' rides and supercharges the wind!');
		if (move.category !== 'Status' && !source.fainted) {
			const m = this.dex.getActiveMove(move.id);
			m.rejuvRidden = true;
			m.type = 'Electric';
			this.actions.useMove(m, target, source);
		}
		return null;
	},
	onAllyAfterMove(user, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Emolga') || move.id !== 'tailwind' || holder.fainted) return;
		this.add('-activate', holder, 'item: ' + this.effect.name);
		this.actions.useMove('discharge', holder);
	},
	num: -3017,
	gen: 9,
}
