import assert from 'node:assert/strict';
import test from 'node:test';
import { groupMusicCollection, orderMusicCollection } from '../src/lib/music-groups.ts';

test('Brian Eno Ambient 1 follows Good Looking and Happy Tunes without disturbing other records', () => {
  const rest = [
    record(1, 'Promised Land (Volume One)', 'Various', ['Jungle']),
    record(2, 'Earth Volume One', 'LTJ Bukem', ['Downtempo'], ['Good Looking Records']),
    record(3, 'Happy Tunes', 'Happy Tunes', ['Happy Hardcore']),
    record(4, 'Haunted Science', 'Omni Trio', ['Drum n Bass']),
    record(5, 'Another Green World', 'Brian Eno', ['Ambient']),
    record(6, 'Trance album', 'Another artist', ['Trance']),
  ];
  const ambient = record(7, 'Ambient 1 (Music For Airports)', 'Brian Eno', ['Ambient'], ['Editions EG']);
  const ordered = orderMusicCollection([...rest, ambient]);
  assert.deepEqual(ordered.slice(0, 5).map(r => r.id), [1, 2, 3, 7, 4]);
  assert.deepEqual(ordered.filter(r => r.id !== 7), orderMusicCollection(rest));
  assert.equal(ordered.length, rest.length + 1);
});

test('the selected jungle, breakbeat and garage artists sit together after Good Looking and Happy Tunes', () => {
  const selected = [
    record(10, 'We Are IE', 'Lennie De Ice', ['Breakbeat', 'Speed Garage']),
    record(11, 'Gotta Maintain', 'Main Phase', ['UK Garage']),
    record(12, 'Locked In, Locked On', 'Mantra', ['Jungle']),
    record(13, 'A Sense Of Summer', 'Mystic Moods', ['Drum n Bass']),
    record(14, 'Haunted Science', 'Omni Trio', ['Drum n Bass']),
    record(15, 'Rogue Satellite', 'Omni Trio', ['Downtempo']),
    record(16, 'The Haunted Science', 'Omni Trio', ['Drum n Bass']),
    record(17, 'Intalect / Discovery', 'Orca', ['Jungle']),
    record(18, 'Atmospheric Funk', 'Wax Doctor', ['Drum n Bass']),
    record(19, 'Heat', 'Wax Doctor', ['Drum n Bass']),
  ];
  const input = [
    record(30, 'Timeless', 'Goldie', ['Drum n Bass']),
    ...selected,
    record(1, 'Promised Land Volume Two', 'Various', ['Drum n Bass']),
    record(2, 'Promised Land (Volume One)', 'Various', ['Drum n Bass']),
    record(3, 'Earth Volume One', 'LTJ Bukem', ['Drum n Bass'], ['Good Looking Records']),
    record(4, 'Happy Tunes', 'Happy Tunes', ['Happy Hardcore']),
    record(40, 'Dance compilation', 'Various', ['Trance']),
  ];
  const output = orderMusicCollection(input);
  const ids = output.map(r => r.id);
  const first = ids.indexOf(4) + 1;
  assert.deepEqual(ids.slice(0, 4), [2, 1, 3, 4]);
  assert.deepEqual(new Set(ids.slice(first, first + selected.length)), new Set(selected.map(r => r.id)));
  assert(ids.indexOf(30) > first + selected.length - 1);
  for (const artist of ['Omni Trio', 'Wax Doctor']) {
    const positions = output.flatMap((r, i) => r.artist === artist ? [i] : []);
    assert.equal(positions.at(-1) - positions[0] + 1, positions.length);
  }
  assert.deepEqual(output.find(r => r.id === 11).styles, ['UK Garage']);
  assert.deepEqual(new Set(ids), new Set(input.map(r => r.id)));
});

function record(id, title, artist, styles = [], labels = []) {
  return { id, title, artist, styles, labels, year: 2000 };
}

test('mixed-style series remain adjacent without losing any releases', () => {
  const records = [
    record(1, 'DJ-Kicks', 'Daddy G', ['Downtempo']),
    record(2, 'DJ-Kicks:', 'Smith & Mighty', ['Jungle']),
    record(3, 'DJ–Kicks: The Black Album', 'Rockers Hi-Fi', ['Drum n Bass']),
    record(4, 'Freezone 2', 'Various', ['Ambient']),
    record(5, 'Freezone 3', 'Various', ['Drum n Bass']),
    record(6, 'Fear Of Flying', 'Big Bud', ['Drum n Bass']),
    record(7, 'Earth Volume One', 'LTJ Bukem', ['Downtempo'], ['Earth Records (36)']),
    record(8, 'Protection', 'Massive Attack', ['Trip Hop']),
  ];
  const ordered = orderMusicCollection(records);
  assert.deepEqual(ordered.map(r => r.id).sort(), records.map(r => r.id).sort());
  for (const group of groupMusicCollection(records)) {
    const positions = group.records.map(r => ordered.findIndex(item => item.id === r.id));
    assert.equal(Math.max(...positions) - Math.min(...positions) + 1, positions.length);
  }
  assert.equal(ordered[0].id, 7);
  assert.equal(ordered.at(-1).id, 8);
});

test('numbered series keep natural volume order across styles', () => {
  const ordered = orderMusicCollection([
    record(3, 'Freezone 6', 'Various', ['Downtempo']),
    record(2, 'Freezone 3', 'Various', ['Drum n Bass']),
    record(1, 'Freezone 2', 'Various', ['Ambient']),
  ]);
  assert.deepEqual(ordered.map(r => r.id), [1, 2, 3]);
});

test('Promised Land volumes lead the collection without changing the remaining order', () => {
  const rest = [
    record(3, 'Earth Volume One', 'LTJ Bukem', ['Downtempo'], ['Earth']),
    record(4, 'DJ-Kicks', 'Daddy G', ['Downtempo']),
    record(5, 'First', 'Example', ['Jungle']),
  ];
  const ordered = orderMusicCollection([
    ...rest,
    record(2, 'Promised Land Volume Two', 'Fabio / Cleveland Watkiss', ['Drum n Bass']),
    record(1, 'Promised Land (Volume One)', 'L.T.J. Bukem / MC Conrad', ['Drum n Bass']),
  ]);
  assert.deepEqual(ordered.slice(0, 2).map(r => r.id), [1, 2]);
  assert.deepEqual(ordered.slice(2), orderMusicCollection(rest));
});

test('artist releases stay together across styles and empty collections work', () => {
  const ordered = orderMusicCollection([
    record(1, 'First', 'Example', ['Jungle']),
    record(2, 'Other', 'Another artist', ['Drum n Bass']),
    record(3, 'Second', 'Example', ['Downtempo']),
  ]);
  const positions = ordered.flatMap((r, i) => r.artist === 'Example' ? [i] : []);
  assert.equal(positions[1] - positions[0], 1);
  assert.deepEqual(orderMusicCollection([]), []);
});

test('Antler-Subway releases stay together, with inner artist and series grouping', () => {
  const records = [
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Promised Land Volume Two', 'Fabio', ['Jungle']),
    record(3, 'Contrast', 'Klinik', [], ['Antler-Subway']),
    record(4, 'Other label release', 'Klinik', [], ['Another label']),
    record(5, 'Suffer', 'Code Industry', ['Techno'], ['Antler–Subway (2)']),
    record(6, 'Live', 'Klinik', [], ['Antler-Subway', 'Antler-Subway']),
    record(7, 'DJ-Kicks', 'Example', [], ['Antler-Subway']),
    record(8, 'Another album', 'Another artist'),
  ];
  const ordered = orderMusicCollection(records);
  assert.deepEqual(ordered.slice(0, 2).map(r => r.id), [1, 2]);
  const positions = ordered.flatMap((r, i) => [3, 5, 6, 7].includes(r.id) ? [i] : []);
  assert.equal(positions.at(-1) - positions[0] + 1, 4);
  const klinik = ordered.flatMap((r, i) => [3, 6].includes(r.id) ? [i] : []);
  assert.equal(klinik[1] - klinik[0], 1);
  assert.deepEqual(ordered.map(r => r.id).sort(), records.map(r => r.id).sort());
});

test('dance catalogues and genres go last without moving unrelated Various or acid jazz', () => {
  const records = [
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Promised Land Volume Two', 'Fabio', ['Jungle']),
    record(3, 'The Dance Opera Trip', 'Various', ['Trance'], ['Dance Opera']),
    record(4, 'Dance Opera Trip 2', 'Various', ['Acid', 'Techno'], ['Dance Opera']),
    record(5, 'Reggae Rock', 'Black Uhuru', ['Reggae'], ['Antler-Subway']),
    record(6, 'Contrast', 'Klinik', ['Industrial'], ['Antler-Subway']),
    record(7, 'Jazz compilation', 'Various', ['Acid Jazz']),
    record(8, 'Ambient album', 'Another artist', ['Ambient']),
    record(9, 'New Beat - Take 4', 'Various', ['New Beat'], ['Subway Dance']),
    record(10, 'New Beat - Take 1', 'Various', ['New Beat'], ['Subway']),
    record(11, 'Strictly Trance 1', 'Various', ['Progressive Trance']),
    record(12, 'DJ-Kicks', 'Mixed artist', ['Techno']),
    record(13, 'DJ-Kicks', 'Jungle artist', ['Jungle']),
    record(14, 'Serious Beats 19', 'Various', ['Trance'], ['Antler-Subway']),
    record(15, 'Serious Beats 11', 'Various', ['Techno'], ['Antler-Subway']),
  ];
  const ordered = orderMusicCollection(records);
  assert.deepEqual(ordered.slice(0, 2).map(r => r.id), [1, 2]);
  const danceIds = new Set([3, 4, 5, 6, 9, 10, 11, 14, 15]);
  assert.ok(ordered.slice(-danceIds.size).every(r => danceIds.has(r.id)));
  assert.deepEqual(ordered.filter(r => [3, 4].includes(r.id)).map(r => r.id), [3, 4]);
  assert.deepEqual(ordered.filter(r => [9, 10].includes(r.id)).map(r => r.id), [10, 9]);
  assert.deepEqual(ordered.filter(r => [14, 15].includes(r.id)).map(r => r.id), [15, 14]);
  assert.equal(Math.abs(ordered.findIndex(r => r.id === 12) - ordered.findIndex(r => r.id === 13)), 1);
  assert.deepEqual(ordered.map(r => r.id).sort((a, b) => a - b), records.map(r => r.id).sort((a, b) => a - b));
});

test('Moby stays above dance and the requested lounge/jazz neighbours follow Den of Thieves', () => {
  const records = [
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Den Of Thieves - The Sound Of Eighteenth Street Lounge Music', 'Various', ['Acid Jazz']),
    record(3, 'Culture Of Fear', 'Thievery Corporation', ['Downtempo']),
    record(4, 'DJ-Kicks:', 'ThieveryCorporation.', ['Downtempo']),
    record(5, 'Charango', 'Morcheeba', ['Trip Hop']),
    record(6, 'Fragments Of Freedom', 'Morcheeba', ['Downtempo']),
    record(7, 'The K&D Sessions™', 'Kruder Dorfmeister', ['Downtempo']),
    record(8, 'Blue Note Trip - Sunset / Sunrise', 'Maestro', ['Jazz-Funk']),
    record(9, 'Blue Note Trip - Goin’ Down / Gettin’ Up', 'Maestro', ['Jazz-Funk']),
    record(10, 'Sketches Of Spain', 'Miles Davis', ['Modal']),
    record(11, 'Bitches Brew', 'Miles Davis', ['Fusion']),
    record(12, 'I Like To Score', 'Moby', ['Techno']),
    record(13, 'Play', 'Moby', ['Downtempo']),
    record(14, 'Acid album', 'Dance artist', ['Acid']),
    record(15, 'DJ-Kicks', 'Another DJ', ['Jungle']),
  ];
  const ordered = orderMusicCollection(records);
  const anchor = ordered.findIndex(r => r.id === 2);
  assert.deepEqual(ordered.slice(anchor, anchor + 10).map(r =>
    /^Den Of Thieves/.test(r.title) ? 'Den' :
    /thievery/i.test(r.artist) ? 'Thievery' :
    r.artist === 'Morcheeba' ? 'Morcheeba' :
    /K&D Sessions/.test(r.title) ? 'K&D' :
    /^Blue Note Trip/.test(r.title) ? 'Blue Note' : 'Miles'),
  ['Den', 'Thievery', 'Thievery', 'Morcheeba', 'Morcheeba', 'K&D', 'Blue Note', 'Blue Note', 'Miles', 'Miles']);
  assert.ok(ordered.findIndex(r => r.id === 12) < ordered.findIndex(r => r.id === 14));
  assert.equal(Math.abs(ordered.findIndex(r => r.id === 12) - ordered.findIndex(r => r.id === 13)), 1);
  assert.equal(ordered[0].id, 1);
  assert.equal(ordered.at(-1).id, 14);
  assert.deepEqual(ordered.map(r => r.id).sort((a, b) => a - b), records.map(r => r.id).sort((a, b) => a - b));
});

test('Happy Tunes follows Good Looking and LTJ before the other jungle and dance records', () => {
  const ordered = orderMusicCollection([
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Earth Volume One', 'LTJ Bukem', ['Downtempo'], ['Earth']),
    record(3, 'Journey Inwards', 'LTJ Bukem', ['Drum n Bass'], ['Good Looking Records']),
    record(4, 'Vol 2 - The Anthem / Pounding Beats', 'Happy Tunes', ['Happy Hardcore'], ['Happy Tunes Records']),
    record(5, 'Jungle album', 'Another artist', ['Jungle']),
    record(6, 'Trance album', 'Dance artist', ['Trance']),
  ]);
  assert.deepEqual(ordered.map(r => r.id), [1, 2, 3, 4, 5, 6]);
});

test('Sven Van Hees albums and his Into Blue compilation stay together', () => {
  const records = [
    record(1, 'Gemini', 'Sven Van Hees', ['Downtempo']),
    record(2, 'Calypso', 'Sven Van Hees', ['Acid Jazz']),
    record(3, "Blue Note's Sidetracks Vol. 3 - Into Blue", 'Various', ['Jazz-Funk']),
    record(4, 'Other compilation', 'Various', ['Jazz']),
    record(5, 'Another album', 'Another artist', ['Downtempo']),
  ];
  const ordered = orderMusicCollection(records);
  const positions = ordered.flatMap((r, i) => [1, 2, 3].includes(r.id) ? [i] : []);
  assert.equal(positions.at(-1) - positions[0] + 1, 3);
  assert.equal(ordered.find(r => r.id === 3).artist, 'Various');
  assert.deepEqual(ordered.map(r => r.id).sort(), records.map(r => r.id).sort());
});

test('Freezone Seven Is Seven Is joins the numbered Freezone volumes', () => {
  const records = [
    record(7, 'Freezone (Seven Is Seven Is)', 'Various', ['Downtempo']),
    record(6, 'Freezone 6 : Fourth Person Singular', 'Various', ['Downtempo']),
    record(2, 'Freezone 2 : Variations On A Chill', 'Various', ['Ambient']),
    record(3, 'Freezone 3 : Horizontal Dancing', 'Various', ['Drum n Bass', 'Techno']),
    record(8, 'Another compilation', 'Various', ['Ambient']),
  ];
  const ordered = orderMusicCollection(records);
  const positions = ordered.flatMap((r, i) => [2, 3, 6, 7].includes(r.id) ? [i] : []);
  assert.equal(positions.at(-1) - positions[0] + 1, 4);
  assert.deepEqual(ordered.filter(r => r.id !== 8).map(r => r.id), [2, 3, 6, 7]);
  assert.deepEqual(ordered.map(r => r.id).sort(), records.map(r => r.id).sort());
});

test('Sounds of 94 is last with the dance records without reclassifying jazz', () => {
  const rest = [
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Gemini', 'Sven Van Hees', ['Downtempo']),
    record(3, 'Strictly Trance 1', 'Various', ['Trance']),
    record(4, 'Contrast', 'Klinik', ['Industrial'], ['Antler-Subway']),
  ];
  const sounds = record(5, "Sounds Of '94", 'Various', ['Acid Jazz', 'Smooth Jazz']);
  const ordered = orderMusicCollection([sounds, ...rest]);
  assert.equal(ordered.at(-1), sounds);
  assert.deepEqual(ordered.slice(0, -1), orderMusicCollection(rest));
  assert.deepEqual(sounds.styles, ['Acid Jazz', 'Smooth Jazz']);
});

test('the whole Sven Van Hees group occupies Into Blue’s former slot before Den of Thieves', () => {
  const records = [
    record(1, 'Promised Land (Volume One)', 'LTJ Bukem', ['Jungle']),
    record(2, 'Den Of Thieves - The Sound Of Eighteenth Street Lounge Music', 'Various', ['Acid Jazz']),
    record(3, 'Culture Of Fear', 'Thievery Corporation', ['Downtempo']),
    record(4, 'Gemini', 'Sven Van Hees', ['Downtempo']),
    record(5, 'Calypso', 'Sven Van Hees', ['Acid Jazz']),
    record(6, "Blue Note's Sidetracks Vol. 3 - Into Blue", 'Various', ['Jazz-Funk']),
    record(7, 'Trance album', 'Dance artist', ['Trance']),
  ];
  const ordered = orderMusicCollection(records);
  const den = ordered.findIndex(r => r.id === 2);
  assert.deepEqual(ordered.slice(den - 3, den).map(r => r.id), [5, 4, 6]);
  assert.equal(ordered[den + 1].id, 3);
  assert.equal(ordered[0].id, 1);
  assert.equal(ordered.at(-1).id, 7);
  assert.deepEqual(ordered.map(r => r.id).sort(), records.map(r => r.id).sort());
});
