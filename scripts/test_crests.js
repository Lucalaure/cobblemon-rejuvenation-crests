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

console.log(failures ? `\n${failures} failure(s)` : '\nall checks passed');
process.exit(failures ? 1 : 0);
