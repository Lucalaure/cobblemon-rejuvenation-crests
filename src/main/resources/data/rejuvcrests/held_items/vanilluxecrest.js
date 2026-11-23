/*
 * Vanilluxe Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * In hail or snow, Speed and Ice moves grow stronger with the weather's remaining turns. Water moves extend the hail instead of hurting it.
 */
{
	name: "Vanilluxe Crest",
	spritenum: 0,
	itemUser: ["Vanilluxe"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Vanilluxe');
	},
	hailing(battle) {
		return battle.field.isWeather(['hail', 'snowscape', 'snow']);
	},
	hailBoost(battle) {
		return 1 + Math.max(0, battle.field.weatherState.duration || 0) * 0.05;
	},
	onModifySpePriority: 2,
	onModifySpe(spe, pokemon) {
		if ((pokemon.baseSpecies.baseSpecies === 'Vanilluxe') && this.effect.hailing(this)) return this.chainModify(this.effect.hailBoost(this));
	},
	onModifyDamage(damage, source, target, move) {
		if ((source.baseSpecies.baseSpecies === 'Vanilluxe') && move.type === 'Ice' && this.effect.hailing(this)) return this.chainModify(this.effect.hailBoost(this));
	},
	onTryHitPriority: 1,
	onTryHit(target, source, move) {
		if (target === source || !(target.baseSpecies.baseSpecies === 'Vanilluxe') || move.type !== 'Water' || move.category === 'Status') return;
		this.add('-immune', target, '[from] item: ' + this.effect.name);
		if (this.effect.hailing(this)) {
			this.field.weatherState.duration = (this.field.weatherState.duration || 0) + 4;
		} else {
			this.field.setWeather(this.dex.conditions.get('hail').exists ? 'hail' : 'snowscape', target);
		}
		return null;
	},
	num: -3044,
	gen: 9,
}
