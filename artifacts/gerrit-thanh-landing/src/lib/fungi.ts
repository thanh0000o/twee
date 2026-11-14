// Mushroom and lichen photos for the {mushrooms & lichen} filter on the visualisations page.
// Names as Gerrit identified them; "(?)" marks an identification he is not sure about.

const files = import.meta.glob('@/assets/visualisations/fungi/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const srcFor = (photo: string) => {
  const match = Object.entries(files).find(([path]) => path.endsWith(`/${photo}.webp`));
  if (!match) throw new Error(`Missing fungi photo ${photo}`);
  return match[1];
};

export type FungusName = { nl: string; en: string; la: string };

const SPECIES: { photos: string[]; name: FungusName }[] = [
  { photos: ['P1110720'], name: { nl: 'Amethistzwam', en: 'Amethyst deceiver', la: 'Laccaria amethystina' } },
  { photos: ['P1110721'], name: { nl: 'Beukenbraakrussula (?)', en: 'Beechwood sickener', la: 'Russula nobilis' } },
  { photos: ['P1110891'], name: { nl: 'Botercollybia (?)', en: 'Butter cap', la: 'Rhodocollybia butyracea' } },
  { photos: ['P1110352'], name: { nl: 'Breedplaatstreepzwam', en: 'Whitelaced shank', la: 'Megacollybia platyphylla' } },
  { photos: ['P1110342', 'P1110347'], name: { nl: 'Bundelfranjehoed', en: 'Common stump brittlestem', la: 'Psathyrella piluliformis' } },
  { photos: ['P1110803'], name: { nl: 'Gewoon eekhoorntjesbrood', en: 'Penny bun / cep', la: 'Boletus edulis' } },
  { photos: ['P1110311'], name: { nl: 'Fluweelboleet (?)', en: 'Suede bolete', la: 'Xerocomus subtomentosus' } },
  { photos: ['P1110801', 'P1110802'], name: { nl: 'Gele knolamaniet, witte vorm (?)', en: 'False deathcap', la: 'Amanita citrina var. alba' } },
  { photos: ['P1110832'], name: { nl: 'Gele korstzwam (?)', en: 'Hairy curtain crust', la: 'Stereum hirsutum' } },
  { photos: ['P1110848'], name: { nl: 'Geschubde inktzwam', en: 'Shaggy ink cap', la: 'Coprinus comatus' } },
  { photos: ['P1110360', 'P1110735'], name: { nl: 'Gewone aardappelbovist', en: 'Common earthball', la: 'Scleroderma citrinum' } },
  { photos: ['P1110353'], name: { nl: 'Gewone hertenzwam (?)', en: 'Deer shield', la: 'Pluteus cervinus' } },
  { photos: ['P1110815'], name: { nl: 'Gewone traanzwam (?)', en: 'Common jellyspot', la: 'Dacrymyces stillatus' } },
  { photos: ['P1110337'], name: { nl: 'Gewone zwavelkop', en: 'Sulphur tuft', la: 'Hypholoma fasciculare' } },
  { photos: ['P1110870'], name: { nl: 'Gewoon groenkopje', en: 'Green elfcup', la: 'Chlorociboria aeruginascens' } },
  { photos: ['P1110308', 'P1110312', 'P1110336'], name: { nl: 'Goudgele zwameter', en: 'Bolete eater', la: 'Hypomyces chrysospermus' } },
  { photos: ['P1110715'], name: { nl: 'Grofplaatrussula', en: 'Blackening brittlegill', la: 'Russula nigricans' } },
  { photos: ['P1110723'], name: { nl: 'Grote knoflooktaailing', en: 'Garlic parachute', la: 'Marasmius alliaceus' } },
  { photos: ['P1110889'], name: { nl: 'Grote knoflooktaailing (?)', en: 'Garlic parachute', la: 'Marasmius alliaceus' } },
  { photos: ['P1110749', 'P1110875'], name: { nl: 'Grote stinkzwam', en: 'Common stinkhorn', la: 'Phallus impudicus' } },
  { photos: ['P1110673'], name: { nl: 'Heksenschermpje', en: 'Rosy bonnet', la: 'Mycena rosea' } },
  { photos: ['P1110729'], name: { nl: 'Heksenschermpje (?)', en: 'Rosy bonnet', la: 'Mycena rosea' } },
  { photos: ['P1110366'], name: { nl: 'Kastanjeboleet', en: 'Bay bolete', la: 'Imleria badia' } },
  { photos: ['P1110853'], name: { nl: 'Kleverig koraalzwammetje', en: 'Yellow stagshorn', la: 'Calocera viscosa' } },
  { photos: ['P1110362'], name: { nl: 'Knolparasolzwam', en: 'Shaggy parasol', la: 'Chlorophyllum rhacodes' } },
  { photos: ['P1110711', 'P1110813', 'P1110814'], name: { nl: 'Parelstuifzwam', en: 'Common puffball', la: 'Lycoperdon perlatum' } },
  { photos: ['P1110779', 'P1110785', 'P1110880', 'P1110885'], name: { nl: 'Porseleinzwam', en: 'Porcelain fungus', la: 'Oudemansiella mucida' } },
  { photos: ['P1110381', 'P1110388'], name: { nl: 'Reuzenzwam', en: 'Giant polypore', la: 'Meripilus giganteus' } },
  { photos: ['P1110835'], name: { nl: 'Reuzenzwam (?)', en: 'Giant polypore', la: 'Meripilus giganteus' } },
  { photos: ['P1110883'], name: { nl: 'Ruig elfenbankje (?)', en: 'Hairy bracket', la: 'Trametes hirsuta' } },
  { photos: ['P1110557', 'P1110561', 'P1110795', 'P1110796', 'P1110798', 'P1110806'], name: { nl: 'Vliegenzwam', en: 'Fly agaric', la: 'Amanita muscaria' } },
  { photos: ['P1110789', 'P1110791'], name: { nl: 'Waaiertje', en: 'Split gill', la: 'Schizophyllum commune' } },
  { photos: ['P1110887'], name: { nl: 'Witte trilzwam (?)', en: 'White brain', la: 'Exidia thuretiana' } },
  { photos: ['P1110712'], name: { nl: 'Parelstuifzwam of aardappelbovist (?)', en: 'Puffball / earthball', la: 'Lycoperdon / Scleroderma' } },
  { photos: ['P1110727'], name: { nl: 'Korstmos (geen paddenstoel)', en: 'Lichen', la: 'Niet te bepalen' } },
  { photos: ['P1110793'], name: { nl: 'Oorzwammetje (?)', en: 'Oysterling', la: 'Crepidotus sp.' } },
  { photos: ['P1110879'], name: { nl: 'Niet te bepalen', en: 'Niet te bepalen', la: 'Niet te bepalen' } },
];

const LANDSCAPE = new Set(['P1110308', 'P1110337', 'P1110388', 'P1110727', 'P1110789', 'P1110815', 'P1110832']);

export type FungusPhoto = { photo: string; src: string; name: FungusName; landscape: boolean };

export const fungiPhotos: FungusPhoto[] = SPECIES.flatMap(({ photos, name }) =>
  photos.map((photo) => ({ photo, src: srcFor(photo), name, landscape: LANDSCAPE.has(photo) })),
);

export const fungusBySrc = new Map(fungiPhotos.map((item) => [item.src, item]));
