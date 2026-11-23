// Loads Cobblemon's bundled Showdown, registers the crest scripts the way Cobblemon's HeldItems loader does,
// and runs battles for every crest. Usage: node test.js <showdown dir> <held_items dir>
const fs = require('fs');
const path = require('path');
const [sd, itemsDir] = process.argv.slice(2);
const {Cobblemon} = require(path.join(sd, 'sim/cobblemon/cobblemon'));
const {Battle} = require(path.join(sd, 'sim/battle'));
const {Dex} = require(path.join(sd, 'sim/dex'));

// Mirror Cobblemon exactly: GraalShowdownService.sendRegistryData strips line breaks from every script,
// joins them into one "{id: script, ...}" object, and index.js receiveData() evals it.
const reg = Cobblemon.getRegistry('heldItem');
const entries = fs.readdirSync(itemsDir).map(f =>
	`${f.replace(/\.js$/, '')}: ${fs.readFileSync(path.join(itemsDir, f), 'utf8').replace(/[\r\n]+/g, '')}`);
const joined = eval(`({${entries.join(', ')}})`);
for (const [id, data] of Object.entries(joined)) reg.register(data, id);
reg.invalidate();
const dex = Dex.mod('cobblemon');

function mon(species, item, moves, extra = {}) {
	return {species, name: species, item, ability: extra.ability || dex.species.get(species).abilities[0], moves,
		nature: 'Hardy', level: 50, evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
		ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, happiness: 200,
		movesInfo: moves.map(() => ({pp: 20, maxPp: 20})), ...extra};
}

function battle(p1, p2, choices, opts = {}) {
	const b = new Battle({formatid: opts.format || 'gen9cobblemonsingles', seed: [1, 2, 3, 4]});
	b.setPlayer('p1', {name: 'A', team: p1});
	b.setPlayer('p2', {name: 'B', team: p2});
	for (const [c1, c2] of choices) {
		if (b.ended) break;
		try { b.makeChoices(c1, c2); } catch (e) {
			if (!/choice|Not all choices/i.test(e.message)) throw e;
			try { b.makeChoices('default', 'default'); } catch (e2) { if (!/choice|Not all choices/i.test(e2.message)) throw e2; }
		}
	}
	return b;
}

let failures = 0;
function check(name, cond, info = '') {
	if (!cond) { failures++; console.log(`FAIL ${name} ${info}`); } else console.log(`ok   ${name}`);
}
const turns = (n, c1 = 'move 1', c2 = 'move 1') => Array(n).fill([c1, c2]);

// 1. Every crest: registered, and a 4-turn battle with its holder runs without throwing.
const crests = JSON.parse(fs.readFileSync(path.join(itemsDir, '../crests.json'), 'utf8'));
const movesFor = {
	default: ['tackle', 'bite', 'protect', 'calmmind'],
};
for (const c of crests) {
	const item = dex.items.get(c.showdownId);
	if (!item.exists) { check(`${c.showdownId} registered`, false); continue; }
	for (const sp of c.species) {
		const species = dex.species.get(sp);
		if (!species.exists) { console.log(`skip ${sp} (not in this dex)`); continue; }
		const learn = (dex.data.Learnsets[species.id] || dex.data.Learnsets[toId(species.baseSpecies)] || {}).learnset || {};
		let moves = Object.keys(learn).filter(m => dex.moves.get(m).exists && !dex.moves.get(m).isNonstandard);
		const pick = ['tackle', 'scratch', 'pound', 'bite', 'quickattack', 'ember', 'watergun', 'thundershock', 'confusion',
			'sunnyday', 'raindance', 'belch', 'furyattack', 'firepunch', 'hyperbeam', 'solarbeam', 'hypervoice', 'nightslash', 'shadowball']
			.filter(m => moves.includes(m));
		moves = [...new Set([...pick, ...moves])].slice(0, 4);
		if (!moves.length) moves = movesFor.default;
		try {
			const b = battle([mon(species.name, c.showdownId, moves)], [mon('Chansey', '', ['tackle', 'growl'])],
				[...turns(1, 'move 1'), ...turns(1, 'move 2'), ...turns(1, 'move 3'), ...turns(1, 'move 4')]);
			const err = b.log.find(l => l.startsWith('|error|'));
			check(`${c.showdownId} on ${species.name} (${moves.join(',')})`, !err, err || '');
		} catch (e) {
			check(`${c.showdownId} on ${species.name}`, false, e.stack.split('\n').slice(0, 4).join(' | '));
		}
	}
}
function toId(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

// 2. Targeted behaviour checks.
const dmgTaken = (b, side = 'p2') => { const p = b[side].pokemon[0]; return p.maxhp - p.hp; };

{ // Typhlosion: contact move hits twice
	const b = battle([mon('Typhlosion', 'typhlosioncrest', ['tackle'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('typhlosion double hit', b.log.some(l => l.startsWith('|-hitcount|') && l.endsWith('|2')), b.log.filter(l => l.includes('hit')).join(' '));
}
{ // Stat crest changes damage
	const a = battle([mon('Dusknoir', '', ['shadowpunch'])], [mon('Mew', '', ['splash'])], turns(1));
	const b = battle([mon('Dusknoir', 'dusknoircrest', ['shadowpunch'])], [mon('Mew', '', ['splash'])], turns(1));
	check('dusknoir crest boosts damage', dmgTaken(b) > dmgTaken(a) * 1.8, `${dmgTaken(a)} -> ${dmgTaken(b)}`);
}
{ // Torterra inverse: Fire becomes resisted
	const a = battle([mon('Charizard', '', ['flamethrower'])], [mon('Torterra', '', ['splash'])], turns(1));
	const b = battle([mon('Charizard', '', ['flamethrower'])], [mon('Torterra', 'torterracrest', ['splash'])], turns(1));
	check('torterra crest inverts fire', dmgTaken(b) < dmgTaken(a) / 2, `${dmgTaken(a)} -> ${dmgTaken(b)}`);
}
{ // Skuntank absorbs ground and gains attack
	const b = battle([mon('Garchomp', '', ['earthquake'])], [mon('Skuntank', 'skuntankcrest', ['splash'])], turns(1));
	check('skuntank ground immunity', dmgTaken(b) === 0 && b.p2.pokemon[0].boosts.atk === 1, `dmg ${dmgTaken(b)} atk ${b.p2.pokemon[0].boosts.atk}`);
}
{ // Crest can't be knocked off
	const b = battle([mon('Weavile', '', ['knockoff'])], [mon('Skuntank', 'skuntankcrest', ['splash'])], turns(1));
	check('crest not removable', b.p2.pokemon[0].item === 'skuntankcrest');
}
{ // Crest does nothing on the wrong species
	const a = battle([mon('Gengar', '', ['shadowball'])], [mon('Chansey', '', ['splash'])], turns(1));
	const b = battle([mon('Gengar', 'hypnocrest', ['shadowball'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('wrong species gets no boost', dmgTaken(a) === dmgTaken(b), `${dmgTaken(a)} vs ${dmgTaken(b)}`);
}
{ // Luxray: Normal moves become Electric
	const b = battle([mon('Luxray', 'luxraycrest', ['tackle'])], [mon('Gastrodon', '', ['splash'])], turns(1));
	check('luxray tackle becomes electric (ground immune)', dmgTaken(b) === 0, `${dmgTaken(b)}`);
}
{ // Furret sets up a substitute
	const b = battle([mon('Furret', 'furretcrest', ['splash'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('furret substitute', !!b.p1.pokemon[0].volatiles['substitute']);
}
{ // Zangoose gets poisoned and heals from it
	const b = battle([mon('Zangoose', 'zangoosecrest', ['splash'], {ability: 'toxicboost'})], [mon('Chansey', '', ['seismictoss'])], turns(2));
	const z = b.p1.pokemon[0];
	check('zangoose poisoned + healing', z.status === 'psn' && b.log.some(l => l.startsWith('|-heal|p1a')), `${z.status}`);
}
{ // Suicune: acts through paralysis, sleep, freeze; no burn damage
	const b = battle([mon('Suicune', 'suicunecrest', ['surf'])], [mon('Breloom', '', ['spore'], {ability: 'technician'})], turns(4));
	const moved = b.log.filter(l => l.startsWith('|move|p1a') && l.includes('Surf')).length;
	check('suicune moves while asleep', moved >= 3, `moved ${moved}x, status ${b.p1.pokemon[0].status}`);
}
{ // Celebi: residual runs twice (Leftovers-like heal from crest-less Leech Seed counts double)
	const b = battle([mon('Celebi', 'celebicrest', ['leechseed'])], [mon('Chansey', '', ['splash'])], turns(1));
	const drains = b.log.filter(l => l.startsWith('|-damage|p2a') && l.includes('Leech Seed')).length;
	check('celebi double residual', drains === 4, `${drains} drains`);
}
{ // Probopass mini noses follow up
	const b = battle([mon('Probopass', 'probopasscrest', ['powergem'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('probopass noses', b.log.filter(l => l.startsWith('|move|p1a')).length === 2, b.log.filter(l => l.startsWith('|move|')).join(' '));
}
{ // Entei fire move hits both foes in doubles
	const b = battle([mon('Entei', 'enteicrest', ['flamethrower']), mon('Chansey', '', ['splash'])],
		[mon('Chansey', '', ['splash']), mon('Blissey', '', ['splash'])], [['move 1 1, move 1', 'move 1, move 1']], {format: 'gen9cobblemondoubles'});
	check('entei spread fire', b.p2.active.every(p => p.hp < p.maxhp));
}

// 3. Crest Emporium crests (by KolinKat).
const moveLines = (b, side) => b.log.filter(l => l.startsWith(`|move|${side}a`));
const run = (name, fn) => { try { fn(); } catch (e) { check(name, false, e.stack.split('\n').slice(0, 3).join(' | ')); } };
run('bellossom copies dances', () => {
	const b = battle([mon('Bellossom', 'bellossomcrest', ['splash'])], [mon('Garchomp', '', ['swordsdance'])], turns(1));
	check('bellossom copies dances', moveLines(b, 'p1').some(l => l.includes('Swords Dance')) && b.p1.pokemon[0].boosts.spe === 1,
		moveLines(b, 'p1').join(' '));
});
run('chatot copies sound + confuses', () => {
	const b = battle([mon('Chatot', 'chatotcrest', ['splash'])], [mon('Chansey', '', ['growl'])], turns(1));
	check('chatot copies sound + confuses', moveLines(b, 'p1').some(l => l.includes('Growl')) && !!b.p2.pokemon[0].volatiles['confusion']);
});
run('girafarig hits twice', () => {
	const b = battle([mon('Girafarig', 'girafarigcrest', ['tackle'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('girafarig hits twice', moveLines(b, 'p1').length === 2, moveLines(b, 'p1').join(' '));
});
run('farigiraf runs', () => {
	const b = battle([mon('Farigiraf', 'girafarigcrest', ['psychic'])], [mon('Chansey', '', ['splash'])], turns(2));
	check('farigiraf runs', dmgTaken(b) > 0);
});
run('carnivine snap trap', () => {
	const b = battle([mon('Carnivine', 'carnivinecrest', ['vinewhip'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('carnivine snap trap', !!b.p2.pokemon[0].volatiles['rejuvcrestsnaptrap']);
});
run('unown hidden power per party member', () => {
	const party = [mon('Unown', 'unowncrest', ['hiddenpower']), mon('Chansey', '', ['splash']), mon('Mew', '', ['splash'])];
	const b = battle(party, [mon('Snorlax', '', ['splash'])], turns(1));
	check('unown hidden power per party member', b.log.some(l => l.startsWith('|-hitcount|') && l.endsWith('|3')), b.log.filter(l => l.includes('hitcount')).join(' '));
});
run('smeargle retypes', () => {
	const b = battle([mon('Smeargle', 'smearglecrest', ['flamethrower', 'surf', 'protect', 'tackle'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('smeargle retypes', b.p1.pokemon[0].getTypes().join() === 'Fire,Water', b.p1.pokemon[0].getTypes().join());
});
run('xatu future sight', () => {
	const b = battle([mon('Xatu', 'xatucrest', ['splash'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('xatu future sight', b.log.some(l => l.includes('Future Sight')));
});
run('delibird sleep + ice present', () => {
	const b = battle([mon('Delibird', 'delibirdcrest', ['present'])], [mon('Dragonite', '', ['splash'])], turns(1));
	check('delibird sleep + ice present', b.p2.pokemon[0].status === 'slp' && b.log.some(l => l.startsWith('|-supereffective|')), b.p2.pokemon[0].status);
});
run('aurorus frostbite', () => {
	const b = battle([mon('Aurorus', 'auroruscrest', ['splash'])], [mon('Machamp', '', ['tackle'])], turns(2));
	check('aurorus frostbite + veil', !!b.p2.pokemon[0].volatiles['rejuvcrestfrostbite'] && !!b.p1.sideConditions['auroraveil']);
});
run('lanturn spotlight drain', () => {
	const b = battle([mon('Lanturn', 'lanturncrest', ['splash'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('lanturn spotlight drain', !!b.p2.pokemon[0].volatiles['rejuvcrestspotlight']);
});
run('cacturne spikes', () => {
	const b = battle([mon('Cacturne', 'cacturnecrest', ['splash'])], [mon('Chansey', '', ['tackle'])], turns(1));
	check('cacturne spikes when hit', !!b.p2.sideConditions['spikes']);
});
run('emolga rides wind', () => {
	const b = battle([mon('Emolga', 'emolgacrest', ['splash'])], [mon('Pidgeot', '', ['hurricane'])], turns(1));
	check('emolga rides wind', b.p1.pokemon[0].hp === b.p1.pokemon[0].maxhp && moveLines(b, 'p1').some(l => l.includes('Hurricane')), moveLines(b, 'p1').join(' '));
});
run('gourgeist trick-or-treat', () => {
	const b = battle([mon('Gourgeist-Super', 'gourgeistcrest', ['tackle'])], [mon('Chansey', '', ['splash'])], turns(2));
	check('gourgeist trick-or-treat', b.p2.pokemon[0].hasType('Ghost') && !!b.p2.pokemon[0].volatiles['leechseed']);
});
run('tyrantrum rampage', () => {
	const b = battle([mon('Tyrantrum', 'tyrantrumcrest', ['tackle'])], [mon('Chansey', '', ['splash'])], turns(1));
	check('tyrantrum rampage', !!b.p1.pokemon[0].volatiles['lockedmove']);
});
run('eldegoss defense', () => {
	const b = battle([mon('Eldegoss', 'eldegosscrest', ['splash'], {ability: 'regenerator'})], [mon('Chansey', '', ['splash'])], turns(2));
	check('eldegoss defense', b.p1.pokemon[0].boosts.def === 2);
});
run('drifblim burn heal', () => {
	const b = battle([mon('Drifblim', 'drifblimcrest', ['splash'])], [mon('Chansey', '', ['nightshade'])], turns(1));
	check('drifblim burn heal', b.p1.pokemon[0].status === 'brn' && b.log.some(l => l.startsWith('|-heal|p1a')));
});
run('chimecho heal bell', () => {
	const b = battle([mon('Chimecho', 'chimechocrest', ['splash']), mon('Mew', '', ['splash'])], [mon('Toxapex', '', ['toxic'])], turns(1));
	check('chimecho heal bell', !b.p1.pokemon[0].status);
});
run('furret female copies speed', () => {
	const m = battle([mon('Furret', 'furretcrest', ['tackle'], {gender: 'M'})], [mon('Mew', '', ['splash'])], turns(1));
	const f = battle([mon('Furret', 'furretcrest', ['tackle'], {gender: 'F'})], [mon('Mew', '', ['splash'])], turns(1));
	check('furret: male sub, female no sub', !!m.p1.pokemon[0].volatiles['substitute'] && !f.p1.pokemon[0].volatiles['substitute']);
});
run('sunflora female sun', () => {
	const f = battle([mon('Sunflora', 'sunfloracrest', ['splash'], {gender: 'F'})], [mon('Charizard', '', ['flamethrower'])], turns(1));
	check('sunflora female: sun + fire immune', f.field.isWeather('sunnyday') && f.p1.pokemon[0].hp === f.p1.pokemon[0].maxhp);
});
run('plusle female helper', () => {
	const f = battle([mon('Plusle', 'pluslecrest', ['tackle', 'growl', 'quickattack', 'charm'], {gender: 'F'})], [mon('Chansey', '', ['splash'])], turns(1));
	check('plusle female helper move', moveLines(f, 'p1').some(l => l.includes('Quick Attack')), moveLines(f, 'p1').join(' '));
});
run('sawsbuck female type', () => {
	const f = battle([mon('Sawsbuck', 'sawsbuckcrest', ['tackle'], {gender: 'F'})], [mon('Chansey', '', ['splash'])], turns(1));
	check('sawsbuck female spring = fairy', f.p1.pokemon[0].getTypes().includes('Fairy'), f.p1.pokemon[0].getTypes().join());
});

console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
