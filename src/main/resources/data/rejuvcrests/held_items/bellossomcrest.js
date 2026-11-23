/*
 * Bellossom Crest (Crest Emporium by KolinKat, for Pokemon Rejuvenation)
 * Copies dance moves used by others, and its dance moves gain extra effects.
 */
{
	name: "Bellossom Crest",
	spritenum: 0,
	itemUser: ["Bellossom"],
	onTakeItem(item, pokemon) {
		/* Crests can't be removed from the Pokemon they belong to. */
		return !(pokemon.baseSpecies.baseSpecies === 'Bellossom');
	},
	/* Copies other Pokemon's dance moves, like Dancer. */
	onAnyAfterMove(user, target, move) {
		const holder = this.effectState.target;
		if (!(holder.baseSpecies.baseSpecies === 'Bellossom') || user === holder || !move.flags['dance'] || move.isExternal || holder.fainted || !holder.isActive) return;
		this.add('-activate', holder, 'item: ' + this.effect.name);
		const dancersTarget = target && !target.isAlly(holder) && user.isAlly(holder) ? target : user;
		this.actions.runMove(move.id, holder, holder.getLocOf(dancersTarget), this.effect, undefined, true);
	},
	onAfterMove(source, target, move) {
		if (!(source.baseSpecies.baseSpecies === 'Bellossom') || !move.flags['dance']) return;
		const foe = target && !target.isAlly(source) ? target : source.adjacentFoes()[0];
		switch (move.id) {
		case 'petaldance':
			source.removeVolatile('lockedmove');
			if (foe && foe.fainted) this.field.setWeather('sunnyday', source);
			break;
		case 'clangoroussoul': this.boost({accuracy: 1}, source, source); break;
		case 'dragondance': source.addVolatile('focusenergy'); break;
		case 'featherdance': if (foe && !foe.fainted) this.boost({spe: -1}, foe, source); break;
		case 'fierydance':
			if (!source.hasType('Fire') && source.addType('Fire')) this.add('-start', source, 'typeadd', 'Fire', '[from] item: ' + this.effect.name);
			break;
		case 'revelationdance':
			source.cureStatus();
			for (const ally of source.adjacentAllies()) ally.cureStatus();
			break;
		case 'quiverdance': source.side.addSideCondition('luckychant', source); break;
		case 'swordsdance': this.boost({spe: 1}, source, source); break;
		case 'teeterdance':
			for (const f of source.adjacentFoes()) this.boost(f.getStat('def') > f.getStat('spd') ? {def: -1} : {spd: -1}, f, source);
			break;
		case 'aquastep': this.field.addPseudoWeather('watersport', source); break;
		case 'victorydance': source.addVolatile('laserfocus'); break;
		}
	},
	onModifyTypePriority: -1,
	onModifyType(move, pokemon) {
		/* After Fiery Dance, its first move becomes Fire-type. */
		if ((pokemon.baseSpecies.baseSpecies === 'Bellossom') && pokemon.hasType('Fire') && pokemon.moveSlots[0] && pokemon.moveSlots[0].id === move.id && move.category !== 'Status') move.type = 'Fire';
	},
	num: -3004,
	gen: 9,
}
