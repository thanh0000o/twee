export type PostLinkKind = 'guestbook' | 'works' | 'artwork' | 'visualisations' | 'about' | 'external';
export type PostSegment =
  | string
  | { text: string; href: string; kind: PostLinkKind }
  | { text: string; kind: 'emphasis' };
export type PostParagraph = PostSegment[];
export type PostHeading = { heading: string };
export type PostBlock = PostParagraph | PostHeading;
export interface PostSource { text: string; href: string }

export type PostTopic = 'philosophy' | 'society' | 'politics & economy' | 'notes';
export const POST_TOPICS: PostTopic[] = ['philosophy', 'society', 'politics & economy', 'notes'];

export interface BlogPost {
  slug: string;
  title: string;
  category: 'site-update' | 'opinion';
  /** Opinion pieces: shown as the title, e.g. {philosophy 0001}, numbered by date. */
  topic?: PostTopic;
  dateTime: string;
  dateLabel: string;
  author: string;
  body: PostBlock[];
  sources?: PostSource[];
  nl?: { body: PostBlock[]; sources?: PostSource[] };
  /** Opinion pieces: how many blocks show before the {read more} button. Defaults to 1. */
  intro?: number;
  /** Shown at the top of its column with a pinned label. */
  pinned?: boolean;
  /** Shown blurred behind a lock until it's ready to read. */
  blurred?: boolean;
  wide?: boolean;
}

const SEPPE_POST_URL = 'https://www.instagram.com/seppedemeulder/';

const guestbook = (text: string): PostSegment => ({ text, href: '#guestbook', kind: 'guestbook' });
const ext = (text: string, href: string): PostSegment => ({ text, href, kind: 'external' });

const SRC = {
  standaard: 'https://www.standaard.be/politiek/wie-knippert-het-eerst-met-de-ogen-cruciale-dag-voor-begrotingsgesprekken-de-wever/162556460.html',
  nieuwsblad: 'https://www.nieuwsblad.be/politiek/weer-strenger-voor-flexi-jobs-en-duurdere-dokters-deze-voorstellen-passeerden-op-het-begrotingsoverleg/162544996.html',
  vrt: 'https://www.vrt.be/vrtnws/nl/2026/06/05/flexijobs-economen-voor-en-nadelen/',
  hlnVooruit: 'https://www.hln.be/binnenland/vooruit-ziet-tot-4-7-miljard-euro-weglekken-via-managementvennootschappen-maar-wat-zijn-dat-het-systeem-roept-ethische-vragen-op~a6835c4a/',
  hlnClub: 'https://www.hln.be/club-brugge/club-brugge-boekt-18-1-miljoen-euro-winst-snoeit-in-lonen-en-zet-cash-opzij-om-stadion-te-financieren~a22fd312/',
  oecdWages: 'https://www.oecd.org/en/publications/2026/04/taxing-wages-2026_d1f39986/full-report/overview_d93131c3.html',
  oecdRevenue: 'https://www.oecd.org/en/publications/2025/12/revenue-statistics-2025_07ca0a8e/full-report/tax-revenue-trends-1965-2024_98c75833.html',
  statbel: 'https://statbel.fgov.be/nl/themas/werk-opleiding/arbeidsmarkt/werkgelegenheid-en-werkloosheid',
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'locked-in',
    title: 'locked in',
    category: 'site-update',
    dateTime: '2026-11-24T11:40:00+01:00',
    dateLabel: '24 November 2026, 11:40 CET',
    author: 'Thành Lambeets',
    body: [
      ["Locked in on TouchDesigner. I'm learning motion design and turning real-life nature into moving digital worlds."],
      ["I'm also building a simple control panel, so you can skip the hard part and go straight to making the TouchDesigner visuals you see online."],
    ],
  },
  {
    slug: 'under-the-noise',
    title: 'under the noise',
    category: 'opinion',
    topic: 'politics & economy',
    dateTime: '2026-11-18T17:05:00+01:00',
    dateLabel: '18 November 2026, 17:05 CET',
    author: 'Thành Lambeets',
    wide: true,
    blurred: true,
    body: [
      ["I still don't really know what to think of the government crisis, and that's why I'm writing about it. It started with the interview with Frank Vandenbroucke on Terzake (", ext("VRT NWS", "https://www.youtube.com/watch?v=LLyBr3uZWjw"), "), a VRT NWS report on the tax benefits for professional footballers (", ext("VRT NWS", "https://www.youtube.com/watch?v=QiABjiq9H94"), ") and an interview with Louis Tobback in Knack (", ext("Knack", "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/"), "). This morning I talked about it for a long time with my father, and that conversation got me thinking further."],
      ["On Sunday 15 November, four parties said yes to Prime Minister De Wever's budget framework, and Vooruit said no. The king then gave the prime minister an extra week (", ext("De Morgen", "https://www.demorgen.be/snelnieuws/live-premier-de-wever-rondt-bilaterale-begrotingsgesprekken-af-nog-onduidelijk-hoe-gesprekken-nu-voortgaan~bf7e76f4/"), "). Since then I mostly hear noise: who leaked what to VTM, and who sat staring stoically at his papers. I wanted to know what lies underneath."],
      ["I'll say it straight away: I notice that I'm close to Frank Vandenbroucke. I think he's a smart man, and a lot of what he says fits my values. That's exactly why I want to stay critical here, about him too."],
      { heading: "the file everyone knows" },
      ["On ", ext("Terzake", "https://www.youtube.com/watch?v=LLyBr3uZWjw"), ", Vandenbroucke picked one example: the tax regime for professional footballers. Clubs pay lower social contributions and may keep a large part of the income tax on their players' wages. According to his office, that costs 253 million euros a year. His reasoning is simple: if you ask pensioners, sick people and workers to give something up, you can't spare well-paid footballers."],
      ["That figure is softer than it sounds. De Tijd wonders whether you would really collect those 253 million if the regime disappeared (", ext("De Tijd", "https://www.tijd.be/ondernemen/sport/wint-regering-echt-250-miljoen-euro-als-sinterklaaspolitiek-voor-voetballers-wegvalt/10705852.html"), "). Philippe Bormans, CEO of Union, speaks in the ", ext("VRT NWS report", "https://www.youtube.com/watch?v=QiABjiq9H94"), " of a realistic saving of around 70 million, and warns that Belgian clubs would no longer be able to keep up with clubs abroad. Research on European footballers also shows that taxes help decide where players go (", ext("Kleven, Landais and Saez", "https://www.aeaweb.org/articles?id=10.1257/aer.103.5.1892"), "). At the same time, MR leader Georges-Louis Bouchez is himself chairman of a football club (", ext("Nieuwsblad", "https://www.nieuwsblad.be/sport/voetbal/vriend-en-vijand-over-georges-louis-bouchez-als-voorzitter-van-francs-borains-puur-ethisch-gezien-is-dit-niet-juist/47145454.html"), "), which makes the file sensitive."],
      ["What I take from it is the principle. Against a 10 billion gap, 70 million is small, but it does say something about who gets spared."],
      { heading: "the tone" },
      ["You can agree with Vandenbroucke and still question his approach. In the same interview he attacked Bouchez personally, and also Maxime Prévot of Les Engagés, who is often his ally at the table. Cd&v deputy prime minister Van Peteghem called it a \"crude attack\" (", ext("De Standaard", "https://www.standaard.be/politiek/van-peteghem-noemt-uitspraken-vandenbroucke-platvloerse-aanval/35089272.html"), "). Louis Tobback says in ", ext("Knack", "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/"), " that Vooruit has already swallowed a lot, from pensions and time-limited unemployment benefits to the expansion of flexi-jobs, and that the pain threshold has been reached. I was critical of that myself, and so was Vooruit really. Still, they looked for a middle ground to reach a deal in a coalition of five parties, and in hard times I can understand that. Vandenbroucke says himself that he's willing to make big concessions, but still wants to be able to look himself in the mirror at night."],
      ["Almost everyone in politics caricatures. Bouchez does it, the scare story about the PS coming back is an example, and Vandenbroucke does it with \"the Verhaeghes of this world\". That's how politicians rally their base, and I don't need to expect anything else from them. For myself, in this place, I do want to set a different bar."],
      { heading: "the conflict underneath" },
      ["Seppe De Meulder looks beyond the noise. According to him, an old conflict of interests between labour and capital is at play. Unions put on pressure through strikes and public opinion. Investors put on pressure by choosing where to invest their money, and the state needs them to finance its debt. In the past, that conflict was absorbed by social dialogue between employers and unions, and he thinks this government doesn't take that dialogue seriously enough. A concrete example: in April, unions and employers in the Group of Ten reached a deal on an alternative to the so-called cent index, and a month later parliament voted the cent index through anyway (", ext("Unizo", "https://www.unizo.be/berichten/pers/unizo-akkoord-sociale-partners-negeren-expertise-en-realiteit-ontkennen"), "). The employers' organisation Unizo regretted that too."],
      ["Here I want to stay critical. Seppe writes from one side, and in his story it's capital that attacks. Someone from N-VA or Voka would say that debt and ageing are the real problem, and that waiting only makes the bill bigger. There are indeed real people behind the financial markets, but they include pension funds and ordinary savers. Whether social dialogue leads to better policy or rather slows reforms down is something people disagree on."],
      { heading: "why it's so hard" },
      ["I wondered why it seems so hard to raise money from wealth and companies, while measures that hit ordinary citizens land on the table faster. Part of the answer is technical. A salary is fully visible, the tax comes off right away, and a small change for millions of people brings in a predictable amount. With wealth, you first need to know what someone owns, and what shares in a family business or property abroad are worth. It also has to hold up legally: in 2019 the Constitutional Court struck down the first securities tax, and in 2022 part of the second (", ext("Constitutional Court", "https://nl.const-court.be/public/n/2022/2022-138n-info.pdf"), "). Wealth can also adapt, which makes the revenue uncertain."],
      ["Management companies are less simple than I thought, too. There was already a change this year: taking profit out of a small company costs more since the May programme law (", ext("Jaarrekening.be", "https://jaarrekening.be/nl/inzichten/liquidatiereserve-vvprbis-2026"), "). People who have such a company are often doctors, consultants or small business owners, and the 4.7 billion Vooruit mentions is an estimate others dispute (", ext("HLN", "https://www.hln.be/binnenland/vooruit-ziet-tot-4-7-miljard-euro-weglekken-via-managementvennootschappen-maar-wat-zijn-dat-het-systeem-roept-ethische-vragen-op~a6835c4a/"), ")."],
      ["It isn't impossible. Switzerland, Verhaeghe's example, has a wealth tax per canton, and Norway and Spain have one as well. The technical problems are real, but they're also a handy argument for those who don't want it for other reasons. \"They don't dare\" is too simple, and so is \"it can't be done\". I think it's harder and the revenue less certain, and that's why governments in a crisis reach sooner for measures that hit many people a little. Whether that's fair remains a political choice."],
      { heading: "equal before the law" },
      ["Along the way I ran into a thought that made me doubt for a moment. I believe everyone should be equal before the law. Doesn't the idea that strong shoulders carry more go against that? When I thought about it longer, it turned out the other way round. Equal before the law means the same rules apply to everyone, not that everyone pays the same amount. The tax brackets are the same for the cashier and the surgeon. Whoever earns more pays more because more of their euros fall into the higher brackets."],
      ["It only rubs when two people earn the same and still pay something very different. Think of a salaried doctor and a doctor with a management company, or a top footballer and an employee with the same gross wage. Then what you pay depends on your setup or your profession, not on what you earn. The Constitution says it itself in article 172: \"No privileges can be introduced in matters of taxation\" (", ext("Constitution", "https://fra.europa.eu/en/law-reference/de-belgische-grondwet-30"), "). Exceptions are allowed, but only with an objective reason that is in proportion to the goal. Some benefits exist to support sport, innovation or a safety net for the self-employed. The question each time is whether that reason still holds today."],
      { heading: "what outsiders say" },
      ["The IMF looks at Belgium from the outside, and its advice doesn't fully please any side (", ext("IMF", "https://www.imf.org/en/news/articles/2026/02/19/pr26057-belgium-imf-executive-board-concludes-2026-article-iv-consultation"), "). It mainly wants to cut current spending and make government more efficient. It also wants to scrap tax benefits that are \"inefficient or no longer serve a policy priority\", together worth around 38 billion euros a year, and to shift part of the tax burden from labour to capital. It calls the new capital gains tax a good step, and says the exemption could be lower \"for higher revenue and fairness\" (", ext("IMF", "https://www.imf.org/en/news/articles/2025/12/15/cs-belgium-staff-concluding-statement-of-the-2026-article-iv-mission"), "). Left and right both find something of themselves in that."],
      { heading: "key learnings" },
      ["The noise about leaks and tone hides a real debate about who carries the load. The football file is mostly a symbol: it speaks to people, but brings in little. A contribution from the strongest shoulders doesn't seem to drive most investors away, although those who are very mobile, like a top footballer, can leave. Taxing wealth is harder than taxing wages, but that's no reason not to try. Strong shoulders carrying more and equality before the law go together, the problem lies in the exceptions. A middle ground in a coalition doesn't betray your values, as long as you know where your limit is. The gap between what Vooruit asks, 1.5 billion, and what was already on the table according to the interview, 1.1 billion, is a political choice (", ext("HBVL", "https://www.hbvl.be/politiek/live-politiek.-premier-de-wever-roept-om-14-uur-zijn-vices-bij-zich/136538115.html"), "). Without more people at work and a more efficient government, you won't close the gap either, however fairly you tax."],
      { heading: "what I take with me" },
      ["I still think that those who stand strongest can carry a little more in hard times. But I don't want to apply that principle blindly. I want to know what a measure brings in, and whether it really makes the bill lighter for ordinary people or only sounds good. What I stand behind most right now is simple: the same rules for everyone, and exceptions only when they're truly deserved. Being close to Vandenbroucke doesn't mean I take over everything he says. I'm curious how this week ends, and whether anyone gives social dialogue its place again. I'm not fully there yet, and maybe that's fine, as long as I keep asking the questions."],
      ["If you read it differently, leave a note in the ", guestbook("guestbook"), "."],
    ],
    sources: [
      { text: "VRT NWS, Frank Vandenbroucke on Terzake", href: "https://www.youtube.com/watch?v=LLyBr3uZWjw" },
      { text: "VRT NWS, tax benefits for footballers", href: "https://www.youtube.com/watch?v=QiABjiq9H94" },
      { text: "Knack, interview with Louis Tobback", href: "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/" },
      { text: "De Morgen, budget liveblog", href: "https://www.demorgen.be/snelnieuws/live-premier-de-wever-rondt-bilaterale-begrotingsgesprekken-af-nog-onduidelijk-hoe-gesprekken-nu-voortgaan~bf7e76f4/" },
      { text: "De Tijd, the 253 million for footballers", href: "https://www.tijd.be/ondernemen/sport/wint-regering-echt-250-miljoen-euro-als-sinterklaaspolitiek-voor-voetballers-wegvalt/10705852.html" },
      { text: "Kleven, Landais and Saez (2013)", href: "https://www.aeaweb.org/articles?id=10.1257/aer.103.5.1892" },
      { text: "Nieuwsblad, Bouchez and Francs Borains", href: "https://www.nieuwsblad.be/sport/voetbal/vriend-en-vijand-over-georges-louis-bouchez-als-voorzitter-van-francs-borains-puur-ethisch-gezien-is-dit-niet-juist/47145454.html" },
      { text: "De Standaard, Van Peteghem on Vandenbroucke", href: "https://www.standaard.be/politiek/van-peteghem-noemt-uitspraken-vandenbroucke-platvloerse-aanval/35089272.html" },
      { text: "Unizo, social partners and the cent index", href: "https://www.unizo.be/berichten/pers/unizo-akkoord-sociale-partners-negeren-expertise-en-realiteit-ontkennen" },
      { text: "Constitutional Court, ruling 138/2022", href: "https://nl.const-court.be/public/n/2022/2022-138n-info.pdf" },
      { text: "Jaarrekening.be, VVPRbis and liquidation reserve", href: "https://jaarrekening.be/nl/inzichten/liquidatiereserve-vvprbis-2026" },
      { text: "HLN, Vooruit on management companies", href: "https://www.hln.be/binnenland/vooruit-ziet-tot-4-7-miljard-euro-weglekken-via-managementvennootschappen-maar-wat-zijn-dat-het-systeem-roept-ethische-vragen-op~a6835c4a/" },
      { text: "Belgian Constitution, article 172", href: "https://fra.europa.eu/en/law-reference/de-belgische-grondwet-30" },
      { text: "IMF, 2026 Article IV consultation", href: "https://www.imf.org/en/news/articles/2026/02/19/pr26057-belgium-imf-executive-board-concludes-2026-article-iv-consultation" },
      { text: "IMF, 2026 staff concluding statement", href: "https://www.imf.org/en/news/articles/2025/12/15/cs-belgium-staff-concluding-statement-of-the-2026-article-iv-mission" },
      { text: "HBVL, Vooruit and the strongest shoulders", href: "https://www.hbvl.be/politiek/live-politiek.-premier-de-wever-roept-om-14-uur-zijn-vices-bij-zich/136538115.html" },
    ],
    nl: {
      body: [
        ["Ik weet nog niet goed wat ik van de regeringscrisis moet denken, en daarom schrijf ik erover. Het begon met het interview met Frank Vandenbroucke in Terzake (", ext("VRT NWS", "https://www.youtube.com/watch?v=LLyBr3uZWjw"), "), een reportage van VRT NWS over de belastingvoordelen voor profvoetballers (", ext("VRT NWS", "https://www.youtube.com/watch?v=QiABjiq9H94"), ") en een interview met Louis Tobback in Knack (", ext("Knack", "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/"), "). Vanochtend sprak ik er nog lang over met mijn vader, en dat gesprek zette me verder aan het denken."],
        ["Op zondag 15 november zeiden vier partijen ja tegen het begrotingskader van premier De Wever, en Vooruit zei nee. De koning gaf de premier daarna een week extra (", ext("De Morgen", "https://www.demorgen.be/snelnieuws/live-premier-de-wever-rondt-bilaterale-begrotingsgesprekken-af-nog-onduidelijk-hoe-gesprekken-nu-voortgaan~bf7e76f4/"), "). Sindsdien hoor ik vooral lawaai: wie lekte wat naar VTM, en wie zat stoïcijns naar zijn blad te staren. Ik wilde weten wat daaronder ligt."],
        ["Ik zeg het meteen: ik merk dat ik dicht bij Frank Vandenbroucke sta. Ik vind hem een slim mens, en veel van wat hij zegt, past bij mijn waarden. Net daarom wil ik hier kritisch blijven, ook over hem."],
        { heading: "het dossier dat iedereen kent" },
        ["Vandenbroucke koos in ", ext("Terzake", "https://www.youtube.com/watch?v=LLyBr3uZWjw"), " één voorbeeld uit: het fiscale gunstregime voor profvoetballers. Clubs betalen minder sociale bijdragen en mogen een groot deel van de loonbelasting van hun spelers zelf houden. Volgens zijn kabinet kost dat 253 miljoen euro per jaar. Zijn redenering is eenvoudig: als je aan gepensioneerden, zieken en werknemers vraagt om in te leveren, kun je goedbetaalde voetballers niet ontzien."],
        ["Dat cijfer is minder hard dan het klinkt. De Tijd vraagt zich af of je die 253 miljoen ook echt binnenhaalt als het regime wegvalt (", ext("De Tijd", "https://www.tijd.be/ondernemen/sport/wint-regering-echt-250-miljoen-euro-als-sinterklaaspolitiek-voor-voetballers-wegvalt/10705852.html"), "). Philippe Bormans, de CEO van Union, spreekt in de ", ext("reportage van VRT NWS", "https://www.youtube.com/watch?v=QiABjiq9H94"), " van een realistische besparing rond 70 miljoen, en waarschuwt dat Belgische clubs dan niet meer meekunnen met het buitenland. Onderzoek naar Europese voetballers toont ook aan dat belastingen mee bepalen waar spelers gaan spelen (", ext("Kleven, Landais en Saez", "https://www.aeaweb.org/articles?id=10.1257/aer.103.5.1892"), "). Tegelijk is MR-voorzitter Georges-Louis Bouchez zelf voorzitter van een voetbalclub (", ext("Nieuwsblad", "https://www.nieuwsblad.be/sport/voetbal/vriend-en-vijand-over-georges-louis-bouchez-als-voorzitter-van-francs-borains-puur-ethisch-gezien-is-dit-niet-juist/47145454.html"), "), wat het dossier gevoelig maakt."],
        ["Wat ik ervan onthoud, is het principe. Op een gat van 10 miljard is 70 miljoen klein, maar het zegt wel iets over wie er gespaard blijft."],
        { heading: "de toon" },
        ["Je kunt het met Vandenbroucke eens zijn en toch vragen stellen bij zijn aanpak. Hij viel in hetzelfde interview Bouchez persoonlijk aan, en ook Maxime Prévot van Les Engagés, die aan tafel vaak zijn bondgenoot is. Cd&v-vicepremier Van Peteghem noemde het een \"platvloerse aanval\" (", ext("De Standaard", "https://www.standaard.be/politiek/van-peteghem-noemt-uitspraken-vandenbroucke-platvloerse-aanval/35089272.html"), "). Louis Tobback zegt in ", ext("Knack", "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/"), " dat Vooruit al veel heeft geslikt, van de pensioenen en de beperking van de werkloosheid in de tijd tot de uitbreiding van de flexi-jobs, en dat de pijngrens bereikt is. Daar was ik zelf ook kritisch over, en Vooruit eigenlijk ook. Toch zochten ze een middenweg om in een coalitie van vijf partijen tot een akkoord te komen, en in moeilijke tijden kan ik daar wel in komen. Vandenbroucke zegt zelf dat hij grote toegevingen wil doen, maar 's avonds nog in de spiegel wil kunnen kijken."],
        ["Karikaturiseren doet bijna iedereen in de politiek. Bouchez doet het, het schrikbeeld van een terugkeer van de PS is er een voorbeeld van, en Vandenbroucke doet het met \"de Verhaeghes van deze wereld\". Zo mobiliseren politici hun achterban, en dat hoef ik van hen niet anders te verwachten. Voor mezelf, op deze plek, wil ik wel een andere lat leggen."],
        { heading: "het conflict eronder" },
        ["Seppe De Meulder kijkt verder dan het lawaai. Volgens hem speelt er een oud belangenconflict tussen arbeid en kapitaal. Vakbonden zetten druk met stakingen en de publieke opinie. Investeerders zetten druk door te kiezen waar ze hun geld investeren, en de staat heeft hen nodig om zijn schuld te financieren. Vroeger werd dat conflict opgevangen door het sociaal overleg tussen werkgevers en vakbonden, en hij vindt dat deze regering dat overleg te weinig ernstig neemt. Een concreet voorbeeld: in april sloten vakbonden en werkgevers in de Groep van Tien een akkoord over een alternatief voor de centenindex, en een maand later stemde het parlement die centenindex toch (", ext("Unizo", "https://www.unizo.be/berichten/pers/unizo-akkoord-sociale-partners-negeren-expertise-en-realiteit-ontkennen"), "). Ook werkgeversorganisatie Unizo betreurde dat."],
        ["Hier wil ik kritisch blijven. Seppe schrijft vanuit één kant, en bij hem is het kapitaal degene die aanvalt. Iemand van N-VA of Voka zou zeggen dat de schuld en de vergrijzing het echte probleem zijn, en dat wachten de rekening alleen groter maakt. Achter de financiële markten zitten inderdaad concrete mensen, maar dat zijn ook pensioenfondsen en gewone spaarders. Of het sociaal overleg tot beter beleid leidt of hervormingen net vertraagt, daar zijn mensen het niet over eens."],
        { heading: "waarom het zo moeilijk ligt" },
        ["Ik vroeg me af waarom het zo moeilijk lijkt om bij vermogens en vennootschappen te halen, terwijl maatregelen voor de gewone burger sneller op tafel liggen. Een deel van het antwoord is technisch. Een loon is volledig zichtbaar, de belasting gaat er meteen af, en een kleine ingreep bij miljoenen mensen levert een voorspelbaar bedrag op. Bij vermogen moet je eerst weten wat iemand bezit, en wat aandelen in een familiebedrijf of vastgoed in het buitenland waard zijn. Het moet ook juridisch standhouden: het Grondwettelijk Hof vernietigde in 2019 de eerste effectentaks, en in 2022 een deel van de tweede (", ext("Grondwettelijk Hof", "https://nl.const-court.be/public/n/2022/2022-138n-info.pdf"), "). Vermogen kan zich bovendien aanpassen, waardoor de opbrengst onzeker is."],
        ["Ook bij managementvennootschappen ligt het minder simpel dan ik dacht. Er werd dit jaar al ingegrepen: winst uit een kleine vennootschap halen kost sinds de programmawet van mei meer dan vroeger (", ext("Jaarrekening.be", "https://jaarrekening.be/nl/inzichten/liquidatiereserve-vvprbis-2026"), "). Wie zo'n vennootschap heeft, is vaak een arts, consultant of kleine ondernemer, en de 4,7 miljard die Vooruit noemt, is een schatting die anderen betwisten (", ext("HLN", "https://www.hln.be/binnenland/vooruit-ziet-tot-4-7-miljard-euro-weglekken-via-managementvennootschappen-maar-wat-zijn-dat-het-systeem-roept-ethische-vragen-op~a6835c4a/"), ")."],
        ["Onmogelijk is het niet. Zwitserland, het voorbeeld van Verhaeghe, heeft een vermogensbelasting per kanton, en ook Noorwegen en Spanje hebben er een. De technische problemen zijn echt, maar ze zijn ook een handig argument voor wie het om andere redenen niet wil. \"Ze durven niet\" is te kort door de bocht, en \"het kan niet\" ook. Ik denk eerder dat het moeilijker is en de opbrengst minder zeker, en dat regeringen in een crisis daarom sneller grijpen naar maatregelen die veel mensen een beetje raken. Of dat eerlijk is, blijft een politieke keuze."],
        { heading: "gelijk voor de wet" },
        ["Onderweg botste ik op een gedachte die me even deed twijfelen. Ik vind dat iedereen gelijk moet zijn voor de wet. Gaat het idee dat sterke schouders meer dragen daar niet tegenin? Toen ik er langer over nadacht, bleek het omgekeerd. Gelijk voor de wet betekent dat voor iedereen dezelfde regels gelden, en niet dat iedereen hetzelfde bedrag betaalt. De belastingschijven zijn voor de kassier en de chirurg dezelfde. Wie meer verdient, betaalt meer omdat meer van zijn euro's in de hogere schijven vallen."],
        ["Het wringt pas bij twee mensen die hetzelfde verdienen en toch iets heel anders betalen. Denk aan een arts in loondienst en een arts met een managementvennootschap, of aan een topvoetballer en een werknemer met hetzelfde brutoloon. Dan hangt wat je betaalt af van je constructie of je beroep, en niet van wat je verdient. De Grondwet zegt het zelf in artikel 172: \"Inzake belastingen kunnen geen voorrechten worden ingevoerd\" (", ext("Grondwet", "https://fra.europa.eu/en/law-reference/de-belgische-grondwet-30"), "). Uitzonderingen mogen, maar alleen met een objectieve reden die in verhouding staat tot het doel. Sommige voordelen bestaan om sport, innovatie of het vangnet van zelfstandigen te ondersteunen. De vraag is telkens of die reden vandaag nog klopt."],
        { heading: "wat de buitenstaanders zeggen" },
        ["Het IMF kijkt van buitenaf naar België, en zijn advies valt aan geen enkele kant helemaal goed (", ext("IMF", "https://www.imf.org/en/news/articles/2026/02/19/pr26057-belgium-imf-executive-board-concludes-2026-article-iv-consultation"), "). Het wil vooral besparen op de lopende uitgaven en de overheid efficiënter maken. Het wil ook belastingvoordelen schrappen die \"inefficiënt zijn of geen duidelijk doel meer dienen\", samen goed voor zo'n 38 miljard euro per jaar, en een deel van de belasting verschuiven van arbeid naar kapitaal. De nieuwe meerwaardebelasting noemt het een goede stap, en volgens het IMF mag de vrijstelling lager \"voor meer opbrengst en eerlijkheid\" (", ext("IMF", "https://www.imf.org/en/news/articles/2025/12/15/cs-belgium-staff-concluding-statement-of-the-2026-article-iv-mission"), "). Rechts en links vinden daar allebei iets in terug."],
        { heading: "key learnings" },
        ["Het lawaai over lekken en toon verbergt een echte discussie over wie de lasten draagt. Het voetbaldossier is vooral een symbool: het spreekt mensen aan, maar levert weinig op. Een bijdrage van de sterkste schouders lijkt de meeste investeerders niet te verjagen, al kan wie heel mobiel is, zoals een topvoetballer, wel vertrekken. Vermogen belasten is moeilijker dan lonen belasten, maar dat is geen reden om het niet te proberen. Sterke schouders die meer dragen en gelijkheid voor de wet gaan samen, het probleem zit bij de uitzonderingen. Een middenweg in een coalitie is geen verraad aan je waarden, zolang je weet waar je grens ligt. Het verschil tussen wat Vooruit vraagt, 1,5 miljard, en wat er volgens het interview al lag, 1,1 miljard, is een politieke keuze (", ext("HBVL", "https://www.hbvl.be/politiek/live-politiek.-premier-de-wever-roept-om-14-uur-zijn-vices-bij-zich/136538115.html"), "). Zonder meer mensen aan het werk en een efficiëntere overheid hou je het gat ook niet dicht, hoe eerlijk je ook belast."],
        { heading: "wat ik meeneem" },
        ["Ik blijf denken dat wie het sterkst staat, in moeilijke tijden iets meer kan dragen. Maar ik wil dat principe niet blind toepassen. Ik wil weten wat een maatregel oplevert, en of hij de rekening voor de gewone mens echt lichter maakt of alleen goed klinkt. Waar ik nu het meest achter sta, is eenvoudig: gelijke regels voor iedereen, en uitzonderingen alleen als ze echt verdiend zijn. Dat ik dicht bij Vandenbroucke sta, betekent niet dat ik alles van hem overneem. Ik ben benieuwd hoe deze week afloopt, en of iemand het sociaal overleg weer een plaats geeft. Volledig mee ben ik nog niet, en misschien hoeft dat ook niet, zolang ik de vragen blijf stellen."],
        ["Lees je het anders, laat dan een berichtje achter in het ", guestbook("gastenboek"), "."],
      ],
      sources: [
        { text: "VRT NWS, Frank Vandenbroucke in Terzake", href: "https://www.youtube.com/watch?v=LLyBr3uZWjw" },
        { text: "VRT NWS, belastingvoordelen voor voetballers", href: "https://www.youtube.com/watch?v=QiABjiq9H94" },
        { text: "Knack, interview met Louis Tobback", href: "https://www.knack.be/nieuws/belgie/politiek/louis-tobback-vooruit-over-regering-de-wever-ik-zie-niet-hoe-dit-nog-te-redden-valt/" },
        { text: "De Morgen, liveblog begroting", href: "https://www.demorgen.be/snelnieuws/live-premier-de-wever-rondt-bilaterale-begrotingsgesprekken-af-nog-onduidelijk-hoe-gesprekken-nu-voortgaan~bf7e76f4/" },
        { text: "De Tijd, de 253 miljoen voor voetballers", href: "https://www.tijd.be/ondernemen/sport/wint-regering-echt-250-miljoen-euro-als-sinterklaaspolitiek-voor-voetballers-wegvalt/10705852.html" },
        { text: "Kleven, Landais en Saez (2013)", href: "https://www.aeaweb.org/articles?id=10.1257/aer.103.5.1892" },
        { text: "Nieuwsblad, Bouchez en Francs Borains", href: "https://www.nieuwsblad.be/sport/voetbal/vriend-en-vijand-over-georges-louis-bouchez-als-voorzitter-van-francs-borains-puur-ethisch-gezien-is-dit-niet-juist/47145454.html" },
        { text: "De Standaard, Van Peteghem over Vandenbroucke", href: "https://www.standaard.be/politiek/van-peteghem-noemt-uitspraken-vandenbroucke-platvloerse-aanval/35089272.html" },
        { text: "Unizo, sociale partners en de centenindex", href: "https://www.unizo.be/berichten/pers/unizo-akkoord-sociale-partners-negeren-expertise-en-realiteit-ontkennen" },
        { text: "Grondwettelijk Hof, arrest 138/2022", href: "https://nl.const-court.be/public/n/2022/2022-138n-info.pdf" },
        { text: "Jaarrekening.be, VVPRbis en liquidatiereserve", href: "https://jaarrekening.be/nl/inzichten/liquidatiereserve-vvprbis-2026" },
        { text: "HLN, Vooruit over managementvennootschappen", href: "https://www.hln.be/binnenland/vooruit-ziet-tot-4-7-miljard-euro-weglekken-via-managementvennootschappen-maar-wat-zijn-dat-het-systeem-roept-ethische-vragen-op~a6835c4a/" },
        { text: "Belgische Grondwet, artikel 172", href: "https://fra.europa.eu/en/law-reference/de-belgische-grondwet-30" },
        { text: "IMF, Article IV-consultatie 2026", href: "https://www.imf.org/en/news/articles/2026/02/19/pr26057-belgium-imf-executive-board-concludes-2026-article-iv-consultation" },
        { text: "IMF, slotverklaring 2026", href: "https://www.imf.org/en/news/articles/2025/12/15/cs-belgium-staff-concluding-statement-of-the-2026-article-iv-mission" },
        { text: "HBVL, Vooruit en de sterkste schouders", href: "https://www.hbvl.be/politiek/live-politiek.-premier-de-wever-roept-om-14-uur-zijn-vices-bij-zich/136538115.html" },
      ],
    },
  },
  {
    slug: 'enough',
    title: 'enough',
    category: 'opinion',
    topic: 'philosophy',
    dateTime: '2026-11-17T18:40:00+01:00',
    dateLabel: '17 November 2026, 18:40 CET',
    author: 'Thành Lambeets',
    wide: true,
    intro: 2,
    body: [
      ["\"When will the rat race end, and when will we finally be satisfied with what we have?\""],
      ["I read that question under a ", ext("video by The Visual Philosopher", "https://www.youtube.com/watch?v=9-PbzIuo78s"), ", among the viewers' comments. It has stayed with me, and I bring a few of their thoughts into this piece. The video is about what people throughout history thought a life well spent looks like."],
      ["It starts with hunter-gatherers. In 1968, anthropologist Marshall Sahlins noted that peoples like the Hadza in Tanzania worked only a few hours a day, though later researchers found it was somewhat more. They didn't own much, but they lacked nothing, because they needed little. Sahlins called it the Zen road to affluence: you can become rich by gathering more and more, or by wanting less. For the ancient Greeks, free time was the goal of life. Their word for it, scholē, is where our word \"school\" comes from. Confucius measured a life by who you become, and ubuntu teaches that you are a person through the people around you. Today we mostly ask one thing of a day: what did you get done?"],
      ["Maybe part of the answer lies in how we look at each other. Those old communities lived fairly isolated. They had to defend themselves against other tribes, but they didn't have to measure themselves against the whole world. We see everyone, every day, on every screen, so everyone tries to climb higher than the rest."],
      ["Technology could have spared us that climb. Work got lighter and faster, and still we don't work less. A family used to live on one income, even with far more work to do at home. Now machines do much of that housework, everything has become more expensive, and an ordinary home often takes two salaries. Everything also changes so fast that you have to keep learning just to keep up. We got no extra rest from it, only a sharper race. We chase the next shiny thing without stopping to wonder what happened to the previous 99."],
      ["Wanting has no end point. A million becomes ten million, and the feeling of enough keeps moving a little further away. For Confucius that was exactly the point: growing as a person is never finished, and he said himself that he had achieved little of it. With possessions it works the other way. What you have quickly becomes normal, and then the chase starts again. Meanwhile we keep pushing life to later. Retirement becomes a lifetime of work to earn your freedom, but by then you're past your best years, and your children are past the age when they needed you most. Later only comes once earlier is gone."],
      ["I like being busy myself. What I struggle with is the voice from outside that says everything has to pay off. The pressure often sits more in my head than in what is actually asked of me. Then I have to remind myself that I'm free, and that something can be worth doing just because I enjoy it. The video shows how deep that voice sits in our language: we spend time and we waste time, as if an hour were a coin."],
      ["I see it around me too. Conversations often turn to money, stocks and what someone still wants to buy. I get that. There are things I like that cost money, and there's nothing wrong with that."],
      ["People have made beautiful things. Cars are a good example, because they sit right on the line. You can love one for what's inside it, the engineering and the design. You can also turn one into a showpiece, a sign that you have money and power. A car also simply costs a lot. I can love them, and I'd like to have one myself. Still, I wouldn't build my life around them. What you wanted so badly feels ordinary after a while, and then you already want the next thing. Maybe the joy lies mostly in the road towards it, and in the people you travel it with."],
      ["I kept thinking of Bart Verhaeghe, who I wrote about in my last piece. In De Afspraak, the conversation was mostly about money and taxes: the tens of millions he already pays, and how nothing more should be added. He believes he would do more good with that money himself than the state does. At the same time he said something that stuck with me: that he still lives the way he did thirty years ago, with the same friends and the same way of life. That makes me curious. If the money doesn't change your life, why does an extra contribution weigh so heavily? I think those who stand strongest can carry a little more in hard times, so things get a bit lighter for ordinary people. Maybe building is the goal in itself for him. I'd like to ask him someday: what does it give you, and when is it enough?"],
      ["What I miss are conversations about what people have made. Music that makes you go quiet. A building you still look at years later. A film you carry around for days. An afternoon in the woods where you do nothing and still see everything. That's what makes me feel rich, and all it costs me is some attention."],
      ["We sometimes forget that we actually just want to live. Life is something unique, and it's allowed to be fun, without too much stress and together with others. We know almost nothing about it, what we're doing here or why we exist. Think about the universe for a moment, about what lies beyond the furthest thing we can see, and your head already breaks. Meanwhile we sit here fighting in politics about who has to pay what. When I think about it too long, it wears me out, and that's a shame. I find ambition beautiful, I just don't understand wanting without end."],
      ["I don't want to make the past prettier than it was. Hunter-gatherer life was hard, and Greek leisure rested on slavery."],
      ["So when does the rat race end? I don't think anyone will stop it for us. Maybe it ends the moment you decide for yourself what enough is, like the Hadza did, and learn to value the road itself. I'm not there yet. Asking the question already feels like a start, though."],
      ["If you read it differently, leave a note in the ", guestbook("guestbook"), "."],
    ],
    sources: [
      { text: "The Visual Philosopher, How Different Cultures Defined a Life Well-Spent", href: "https://www.youtube.com/watch?v=9-PbzIuo78s" },
    ],
    nl: {
      body: [
        ["\"Wanneer eindigt de ratrace, en zijn we eindelijk tevreden met wat we hebben?\""],
        ["Die vraag las ik onder een ", ext("video van The Visual Philosopher", "https://www.youtube.com/watch?v=9-PbzIuo78s"), ", tussen de reacties van kijkers. Ze is me blijven volgen, en een paar van hun gedachten neem ik in dit stuk mee. De video gaat over wat mensen door de eeuwen heen een goed besteed leven vonden."],
        ["Hij begint bij de jagers-verzamelaars. Antropoloog Marshall Sahlins merkte in 1968 op dat volkeren als de Hadza in Tanzania maar enkele uren per dag werkten, al vonden latere onderzoekers dat het er wat meer waren. Veel bezaten ze niet, maar ze kwamen niets tekort, omdat ze weinig nodig hadden. Sahlins noemde dat de zen-weg naar overvloed: je kunt rijk worden door steeds meer te verzamelen, of door minder te willen. Voor de oude Grieken was vrije tijd het doel van het leven. Hun woord ervoor, scholē, is het woord waar ons \"school\" van komt. Confucius vond dat je een leven afmeet aan wie je wordt, en ubuntu leert dat je iemand bent door de mensen rondom je. Vandaag stellen we vooral één vraag aan een dag: wat heb je gedaan gekregen?"],
        ["Misschien ligt een deel van het antwoord in hoe we naar elkaar kijken. Die oude gemeenschappen leefden vrij afgezonderd. Ze moesten zich verdedigen tegen andere stammen, maar ze hoefden zich niet te meten met de hele wereld. Wij zien iedereen, elke dag, op elk scherm, en dus probeert iedereen hoger te klimmen dan de rest."],
        ["Technologie had ons die klim kunnen besparen. Het werk werd lichter en sneller, en toch werken we niet minder. Vroeger kon een gezin leven van één inkomen, terwijl er thuis veel meer te doen was. Nu doen machines een groot deel van dat huishoudwerk, alles is duurder geworden, en voor een gewone woning zijn vaak twee lonen nodig. Alles verandert ook zo snel dat je voortdurend moet bijleren om niet achter te blijven. We kregen er geen rust bij, wel een scherpere wedstrijd. We jagen het volgende glimmende ding na, zonder stil te staan bij wat er met de vorige 99 gebeurd is."],
        ["Willen heeft geen eindpunt. Een miljoen wordt tien miljoen, en het gevoel van genoeg schuift telkens een stukje op. Bij Confucius is dat net de bedoeling: zelfontplooiing raakt nooit af, en hij zei zelf dat hij er weinig van bereikt had. Bij bezit werkt het omgekeerd. Wat je hebt, wordt snel gewoon, en dan begint het jagen opnieuw. Ondertussen schuiven we het leven op naar later. Pensioen wordt een leven lang werken om je vrijheid te verdienen, maar tegen dan ben je je beste jaren voorbij, en zijn je kinderen de leeftijd voorbij waarop ze je het meest nodig hadden. Later komt pas als het vroeger al voorbij is."],
        ["Ik ben zelf graag bezig. Waar ik mee worstel, is de stem van buitenaf die zegt dat alles iets moet opbrengen. De druk zit vaak meer in mijn hoofd dan in wat er echt van me gevraagd wordt. Dan moet ik mezelf eraan herinneren dat ik vrij ben, en dat iets ook de moeite waard kan zijn omdat ik het graag doe. De video toont hoe diep die stem in onze taal zit: we besteden tijd en we verliezen tijd, alsof een uur een munt is."],
        ["In mijn omgeving zie ik het ook. Gesprekken draaien vaak rond geld, aandelen en wat iemand nog wil kopen. Ik begrijp dat wel. Ik vind zelf ook dingen mooi die geld kosten, en daar is niets mis mee."],
        ["Mensen hebben prachtige dingen gemaakt. Auto's zijn daar een goed voorbeeld van, omdat ze precies op de grens liggen. Je kunt ervan houden om wat erin zit, de techniek en het ontwerp. Je kunt er ook een pronkstuk van maken, een teken dat je geld en macht hebt. Een auto kost ook gewoon veel geld. Ik kan ervan houden, en ik zou er zelf graag een hebben. Toch zou ik mijn leven er niet omheen bouwen. Wat je zo graag wilde, voelt na een tijdje gewoon, en dan wil je alweer het volgende. Misschien zit het plezier vooral in de weg ernaartoe, en in de mensen met wie je die weg aflegt."],
        ["Ik moest terugdenken aan Bart Verhaeghe, over wie ik in mijn vorige stuk schreef. In De Afspraak ging het vooral over geld en belastingen: over de tientallen miljoenen die hij al betaalt, en dat er niets meer bij mag. Hij vindt dat hij met dat geld zelf meer goeds zou doen dan de staat. Tegelijk zei hij iets wat me bijbleef: dat hij nog leeft zoals dertig jaar geleden, met dezelfde vrienden en dezelfde manier van leven. Dat maakt me net nieuwsgierig. Als het geld je leven niet verandert, waarom weegt een extra bijdrage dan zo zwaar? Ik denk dat wie het sterkst staat, in moeilijke tijden even iets meer kan dragen, zodat het voor de gewone mens wat lichter wordt. Misschien is bouwen voor hem het doel op zich. Ik zou het hem graag eens vragen: wat geeft het je, en wanneer is het genoeg?"],
        ["Wat ik mis, zijn de gesprekken over wat mensen gemaakt hebben. Muziek die je stil krijgt. Een gebouw waar je na jaren nog naar kijkt. Een film die je dagen met je meedraagt. Een namiddag in het bos waarin je niets doet en toch alles ziet. Daar voel ik me rijk door, en het kost me alleen wat aandacht."],
        ["We vergeten soms dat we eigenlijk gewoon willen leven. Het leven is iets unieks, en het mag leuk zijn, zonder al te veel stress en samen met anderen. We weten er bijna niets over, wat we hier doen of waarom we er zijn. Denk even na over het heelal, over wat er achter het verste ligt dat we kunnen zien, en je hoofd breekt al. Intussen zitten wij hier in de politiek te vechten over wie wat moet betalen. Als ik daar te lang over nadenk, word ik er moe van, en dat vind ik jammer. Ambitie vind ik mooi, alleen begrijp ik willen zonder einde niet."],
        ["Ik wil het verleden niet mooier maken dan het was. Het leven van jagers-verzamelaars was hard, en de Griekse vrije tijd werd gedragen door slaven."],
        ["Dus, wanneer eindigt de ratrace? Ik denk niet dat iemand haar voor ons stopt. Misschien eindigt ze op het moment dat je zelf beslist wat genoeg is, zoals de Hadza deden, en je de weg zelf leert waarderen. Zover ben ik nog niet. De vraag stellen voelt wel al als een begin."],
        ["Lees je het anders, laat dan een berichtje achter in het ", guestbook("gastenboek"), "."],
      ],
      sources: [
        { text: "The Visual Philosopher, How Different Cultures Defined a Life Well-Spent", href: "https://www.youtube.com/watch?v=9-PbzIuo78s" },
      ],
    },
  },
  {
    slug: 'before-you-read',
    title: 'before you read',
    category: 'opinion',
    topic: 'notes',
    dateTime: '2026-11-17T17:40:00+01:00',
    dateLabel: '17 November 2026, 17:40 CET',
    author: 'Thành Lambeets',
    pinned: true,
    body: [
      ["One thing before you start: these are the first opinion pieces I've ever written. I'm not a journalist or an expert. I write about whatever is on my mind, from philosophy and my own way of looking at things to culture, social issues and sometimes the news. Often it starts with a post, a conversation or a moment on TV that sticks with me and won't let go until I've read more about it."],
      ["When I write, I try to stay in the middle. I want to understand both sides and leave room for nuance, even when it feels like everyone online is shouting over each other. I don't always manage, but I learn a bit more with every piece, and there are more on the way."],
      ["If something isn't clear or you see it differently, I'd love to hear it. Leave a note in the ", guestbook('guestbook'), '. Thanks for reading, and enjoy.'],
    ],
    nl: {
      body: [
        ["Eén ding voor je begint: dit zijn de eerste opiniestukken die ik ooit geschreven heb. Ik ben geen journalist of expert. Ik schrijf over wat me bezighoudt, van filosofie en mijn eigen kijk op dingen tot cultuur, sociale thema's en soms het nieuws. Vaak begint het met een post, een gesprek of een moment op tv dat blijft hangen en me niet loslaat tot ik er meer over gelezen heb."],
        ['Als ik schrijf, probeer ik in het midden te blijven. Ik wil beide kanten begrijpen en ruimte laten voor nuance, ook als het online voelt alsof iedereen door elkaar roept. Dat lukt niet altijd, maar met elk stuk leer ik wat bij, en er komen er nog.'],
        ['Is iets niet duidelijk of zie je het anders, dan hoor ik het graag. Laat een berichtje achter in het ', guestbook('gastenboek'), '. Bedankt om te lezen, en veel leesplezier.'],
      ],
    },
  },
  {
    slug: 'mushrooms-and-a-dj-usb',
    title: 'mushrooms, a dj usb and a new app',
    category: 'site-update',
    dateTime: '2026-11-15T00:13:00+01:00',
    dateLabel: '15 November 2026, 00:13 CET',
    author: 'Thành Lambeets',
    body: [
      ["I'm still working on my opinion pieces. I've also started on a new app, more about that later."],
      [
        "My DJ USB was a mess. I'm pretty disorganised, so my music was spread over folders all over my computer. A while ago I also deleted a big part of my music by accident. I got it back, but after that Rekordbox couldn't find a lot of my tracks, and relocating them by hand didn't work. So I wrote a script that found every track again and put my music in order. The USB works again.",
      ],
      [
        'Today I walked for more than five hours in the Zoniënwoud in Tervuren. I found a lot of mushrooms on the way. I edited the photos and put them on the ',
        { text: 'visualisations', href: '/visualisations?from=blog-links', kind: 'visualisations' },
        ' page, under the ',
        { text: 'mushrooms & lichen', href: '/visualisations?from=blog-links&filter=mushrooms', kind: 'visualisations' },
        ' filter.',
      ],
    ],
  },
  {
    slug: 'reworking-my-opinion-pieces',
    title: 'reworking my opinion pieces',
    category: 'site-update',
    dateTime: '2026-11-07T13:40:00+01:00',
    dateLabel: '7 November 2026, 13:40 CET',
    author: 'Thành Lambeets',
    body: [
      [
        "I've put my opinion pieces behind a lock for now, because I'm rewriting them. Reading them back, I noticed some things are missing. I don't explain where the question came from, why I wanted to write about it, or who helped me think it through. I want to add that, so the pieces are stronger and it's clearer to you where they come from. They'll be back when they're done.",
      ],
      ["I'm also writing two new ones."],
    ],
  },
  {
    slug: 'breendonk-and-a-radio',
    title: 'photos, a radio and new pieces',
    category: 'site-update',
    dateTime: '2026-11-04T20:47:00+01:00',
    dateLabel: '4 November 2026, 20:47 CET',
    author: 'Thành Lambeets',
    body: [
      [
        'New photos on the ',
        { text: 'visualisations', href: '/visualisations?from=blog-links', kind: 'visualisations' },
        ' page. I went to Fort Breendonk and edited the pictures.',
      ],
      [
        "I'm making a radio station for the world wide web. The player is a 3D remake of my own sound system, a ",
        ext('Sony LBT-D305', 'https://www.radiomuseum.org/r/sony_compact_hifi_stereo_system_lbt_d305_hst_d305_ps_lx46.html#collection'),
        ". It's not live yet. New opinion pieces are coming too.",
      ],
    ],
  },
  {
    slug: 'a-fair-share',
    title: 'a fair share',
    category: 'opinion',
    topic: 'politics & economy',
    dateTime: '2026-10-30T15:40:00+01:00',
    dateLabel: '30 October 2026, 15:40 CET',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      ['The question I keep coming back to: who pays the bill in Belgium, and is it shared fairly? It came up because of the budget talks of the De Wever government and an episode of De Afspraak with Bart Verhaeghe, the chairman of Club Brugge. Online I mostly saw angry reactions from both sides, so I wanted to find out for myself what is on the table.'],
      ["A note first: I don't follow politics closely. This blog is where I write down my thoughts, and sometimes I feel like reading up on something. With topics like this one, where the debate is so polarised, I mostly want to understand what's going on and put my thoughts on paper."],
      { heading: "what's on the table" },
      ['The government still has to find around 10 billion euros by 2029 (', ext('De Standaard', SRC.standaard), '). The options include a VAT increase from 21 to 22 percent, which four of the five parties support and MR opposes (', ext('Nieuwsblad', SRC.nieuwsblad), '), stricter rules for management companies and changes to flexi-jobs. With a management company, a self-employed person or manager invoices through their own company, which works out cheaper than a normal salary. Vooruit estimates the state misses out on up to 4.7 billion euros a year because of it (', ext('HLN', SRC.hlnVooruit), ').'],
      { heading: 'what I had to adjust' },
      ["My first thought was that big companies and big fortunes can spare the money. After some reading, it wasn't that simple. Management companies are legal. It's tax avoidance within the rules, and if you want to change that, you have to change the rules. The people who have one are usually doctors, consultants or IT people with a one-person company, a different group than I had in mind. And money leaving Belgium is already partly taxed: there is a tax on dividends going abroad, there are rules against shifting profits to tax havens, and since 2024 large multinationals pay a European minimum tax of 15 percent. Going much further only works if European countries get stricter together."],
      { heading: 'the other side' },
      ['MR and partly N-VA see the problem elsewhere: too few people work, and labour is taxed more heavily here than almost anywhere else (', ext('OECD', SRC.oecdWages), "). Lower taxes on labour should bring more jobs, and those jobs partly pay the measure back. Entrepreneurs also point out that they take risks without an employee's safety net, and that they reinvest their profit. Tax that harder, and they might invest less or leave. What struck me is that greed usually isn't what drives them. They have a different idea of what is fair."],
      { heading: 'what Verhaeghe says' },
      ["In De Afspraak, Verhaeghe asked for no more new taxes, because according to him Belgium is 'the world champion'. For labour, he's right: 52.5 percent, the highest in the OECD (", ext('OECD', SRC.oecdWages), '). For all taxes together, Denmark, France, Austria and Italy are higher (', ext('OECD', SRC.oecdRevenue), "). That there are 'more inactive people than active ones' only holds if you count children and pensioners. Of people aged 20 to 64, 72.8 percent work (", ext('Statbel', SRC.statbel), "). I couldn't check his claim that Club Brugge pays 20 percent of its turnover to the state. In 2024-2025 the club paid around 7.6 million euros in corporate tax (", ext('HLN', SRC.hlnClub), "), so to reach 20 percent he has to count social contributions and the tax on the players' wages too. @seppedemeulder also pointed out that in the same conversation he said sick people are 'not all really sick', and that he wants people who pay more to count for more. In a democracy every vote weighs the same."],
      { heading: 'where I stand' },
      ["In our society you can start your own business, but not everyone gets that chance, and not everyone wants to. Most people just want a decent life, with a steady job and some breathing room at the end of the month. A society has to work for them too, even if they never start a business."],
      ["That idea is basically what Belgian social security is built on. Those who are stronger carry more, so those who are weaker don't fall. Anyone who succeeds also owes that to what society around them makes possible: education, roads, healthy workers, legal certainty."],
      ["So I think it's a shame that the bill now threatens to land mostly on ordinary workers and sick people, while setups like management companies leave contributions on the table."],
      ["Now that we have a budget deficit, I think people who have it easier can contribute a bit more for a while than the average middle-class person. An extra contribution weighs less on someone with more room than on a family that has to count every euro each month. A VAT increase hits everyone, and weighs most on people who spend almost all their income on ordinary things."],
      ["It's about a contribution based on what you can carry in hard times. Punishing entrepreneurs is never the point. Nobody is against entrepreneurs. The idea is just that everyone chips in."],
      ["Entrepreneurs say they reinvest their profit in machines and jobs. That they create jobs is good. But does that reinvesting happen enough? Part of the profit goes back into the company, part goes to dividends, and that differs a lot per company. Verhaeghe himself said the number of machines in Belgian factories is going down. So I'd like to see that argument proven first."],
      ["What strikes me most in this debate is that both sides feel caricatured. One side hears that it's against entrepreneurs. Entrepreneurs hear that they're freeloaders with a swimming pool, and feel treated like villains. That's where the conversation gets stuck. I try to stick to the question: a temporary, fair contribution based on what people can carry, and proof that profit really ends up in jobs and investment."],
      ["But I don't want to make it too simple either. If you want to talk about big fortunes, you should really be talking about a wealth or capital gains tax. The consultant with a one-person company is someone else."],
      { heading: 'questions I still have' },
      ['How many jobs does a tax cut on labour really create? How much profit goes back into the company, and how much goes to dividends? Can you tackle management companies without punishing small self-employed people who have no safety net? And will this government dare to push in Europe for a minimum tax rate above 15 percent?'],
      ["This is only a small part of the story. Everything is connected, and I could add a lot more nuance and bring in more things. I'll keep writing down my thoughts here, and I'll always try to explain clearly what I mean, so nothing gets misunderstood. If you read it differently, leave a note in the ", guestbook('guestbook'), '.'],
    ],
    sources: [
      { text: 'De Standaard, budget talks', href: SRC.standaard },
      { text: 'Nieuwsblad, budget proposals', href: SRC.nieuwsblad },
      { text: 'HLN, Vooruit on management companies', href: SRC.hlnVooruit },
      { text: 'HLN, Club Brugge results 2024-2025', href: SRC.hlnClub },
      { text: 'OECD, Taxing Wages 2026', href: SRC.oecdWages },
      { text: 'OECD, Revenue Statistics 2025', href: SRC.oecdRevenue },
      { text: 'Statbel, employment and unemployment', href: SRC.statbel },
    ],
    nl: {
      body: [
        ['De vraag waar ik steeds op terugkom: wie betaalt in België de rekening, en is dat eerlijk verdeeld? Ze kwam bij me op door het begrotingsdebat van de regering-De Wever en een aflevering van De Afspraak met Bart Verhaeghe, de voorzitter van Club Brugge. Online zag ik vooral boze reacties van beide kanten, dus ik wilde zelf uitzoeken wat er op tafel ligt.'],
        ['Eerst dit: ik volg de politiek niet op de voet. Dit blog is de plek waar ik mijn gedachten opschrijf, en soms heb ik zin om me ergens in te lezen. Bij onderwerpen als dit, waar het debat zo gepolariseerd is, wil ik vooral begrijpen wat er speelt en mijn gedachten op papier zetten.'],
        { heading: 'wat er op tafel ligt' },
        ["De regering moet tegen 2029 nog zo'n 10 miljard euro vinden (", ext('De Standaard', SRC.standaard), '). Op tafel liggen onder meer een btw-verhoging van 21 naar 22 procent, waar vier van de vijf partijen voor zijn en de MR tegen (', ext('Nieuwsblad', SRC.nieuwsblad), '), strengere regels voor managementvennootschappen en een aanpassing van de flexi-jobs. Bij een managementvennootschap factureert een zelfstandige of manager via een eigen bedrijf, wat goedkoper uitkomt dan een gewoon loon. Vooruit schat dat de staat daardoor tot 4,7 miljard euro per jaar misloopt (', ext('HLN', SRC.hlnVooruit), ').'],
        { heading: 'wat ik moest bijstellen' },
        ["Mijn eerste gedachte was dat grote bedrijven en grote vermogens het geld wel kunnen missen. Na wat lezen lag het minder simpel. Managementvennootschappen zijn legaal. Het is belastingontwijking binnen de regels, en wie dat wil veranderen, moet de regels veranderen. Wie er een heeft, is meestal een arts, consultant of IT'er met een eenmanszaak, een andere groep dan ik in gedachten had. En geld dat België verlaat, wordt al deels belast: er is een belasting op dividenden naar het buitenland, er zijn regels tegen winstverschuiving naar belastingparadijzen, en sinds 2024 betalen grote multinationals een Europese minimumbelasting van 15 procent. Veel verder gaan lukt alleen als Europese landen samen strenger worden."],
        { heading: 'de andere kant' },
        ['MR en deels N-VA zien het probleem elders: er werken te weinig mensen, en arbeid wordt hier zwaarder belast dan bijna overal anders (', ext('OESO', SRC.oecdWages), '). Lagere lasten op arbeid moeten jobs opleveren, en die jobs betalen de maatregel deels terug. Ondernemers wijzen er ook op dat ze risico nemen zonder het vangnet van een werknemer, en dat ze hun winst herinvesteren. Belast je dat zwaarder, dan investeren ze misschien minder of trekken ze weg. Wat me opviel, is dat hebzucht meestal niet de drijfveer is. Ze hebben een ander idee van wat eerlijk is.'],
        { heading: 'wat Verhaeghe zegt' },
        ["Verhaeghe vroeg in De Afspraak om geen nieuwe belastingen meer, omdat België volgens hem 'kampioen van de wereld' is. Voor arbeid heeft hij gelijk: 52,5 procent, de hoogste van de OESO (", ext('OESO', SRC.oecdWages), '). Voor alle belastingen samen liggen Denemarken, Frankrijk, Oostenrijk en Italië hoger (', ext('OESO', SRC.oecdRevenue), "). Dat er 'meer niet-actieven dan actieven' zijn, klopt alleen als je kinderen en gepensioneerden meetelt. Van de 20- tot 64-jarigen werkt 72,8 procent (", ext('Statbel', SRC.statbel), '). Dat Club Brugge 20 procent van zijn omzet aan de staat betaalt, kon ik niet controleren. In 2024-2025 betaalde de club zo\'n 7,6 miljoen euro vennootschapsbelasting (', ext('HLN', SRC.hlnClub), "), dus om aan 20 procent te komen, moet hij ook de sociale bijdragen en de belasting op de lonen van de spelers meetellen. @seppedemeulder wees er nog op dat hij in hetzelfde gesprek zei dat zieken 'niet echt allemaal ziek zijn', en dat hij wie meer betaalt ook meer wil laten meetellen. In een democratie telt elke stem even zwaar."],
        { heading: 'waar ik sta' },
        ['In onze samenleving kun je een eigen zaak beginnen, maar niet iedereen krijgt die kans, en niet iedereen wil dat. De meeste mensen willen gewoon een degelijk leven, met een vaste job en wat ademruimte op het einde van de maand. Een samenleving moet ook voor hen werken, ook als ze nooit een bedrijf starten.'],
        ['Dat idee zit eigenlijk in de kern van de Belgische sociale zekerheid. Wie sterker staat, draagt meer, zodat wie zwakker staat niet valt. Wie succes heeft, dankt dat ook aan wat de samenleving rondom hem mogelijk maakt: onderwijs, wegen, gezonde werknemers, rechtszekerheid.'],
        ['Ik vind het daarom jammer dat de factuur nu vooral bij gewone werknemers en zieken terecht dreigt te komen, terwijl constructies als managementvennootschappen bijdragen laten liggen.'],
        ['Nu we in een begrotingstekort zitten, vind ik dat wie het makkelijker heeft even meer kan bijdragen dan de gewone middenklasser. Een extra bijdrage weegt minder door bij wie meer ruimte heeft dan bij een gezin dat elke maand moet rekenen. Een btw-verhoging treft iedereen, en weegt het zwaarst bij wie bijna zijn hele inkomen uitgeeft aan gewone aankopen.'],
        ['Het gaat om een bijdrage naar draagkracht in moeilijke tijden. Ondernemen afstraffen is nooit de bedoeling. Niemand is tegen ondernemers. Het idee is gewoon dat iedereen meedraagt.'],
        ['Ondernemers zeggen dat ze hun winst herinvesteren in machines en jobs. Dat ze jobs scheppen, is goed. Maar gebeurt dat herinvesteren ook genoeg? Een deel van de winst gaat terug naar het bedrijf, een deel naar dividenden, en dat verschilt sterk per bedrijf. Verhaeghe zei zelf dat het aantal machines in Belgische fabrieken daalt. Dat argument wil ik dus eerst bewezen zien.'],
        ['Wat me in dit debat het meest opvalt, is dat beide kanten zich gekarikaturiseerd voelen. De ene kant hoort dat ze tegen ondernemers is. Ondernemers horen dat ze profiteurs met een zwembad zijn, en voelen zich behandeld als schurk. Daar loopt het gesprek vast. Ik probeer zelf bij de vraag te blijven: een tijdelijke, eerlijke bijdrage naar draagkracht, en bewijs dat winst echt in jobs en investeringen terechtkomt.'],
        ['Maar ik wil het ook niet te simpel maken. Wie over grote vermogens wil praten, moet het eigenlijk over een vermogens- of meerwaardebelasting hebben. De consultant met een eenmanszaak is iemand anders.'],
        { heading: 'vragen die ik nog heb' },
        ['Hoeveel jobs levert een lastenverlaging op arbeid echt op? Hoeveel winst gaat terug naar het bedrijf, en hoeveel naar dividenden? Kun je managementvennootschappen aanpakken zonder kleine zelfstandigen zonder vangnet te straffen? En durft deze regering in Europa te pleiten voor een minimumtarief boven 15 procent?'],
        ['Dit is maar een klein stukje van het verhaal. Alles hangt met elkaar samen, en ik kan nog veel meer nuanceren en er meer bij betrekken. Ik blijf hier mijn gedachten opschrijven, en ik probeer altijd duidelijk uit te leggen wat ik bedoel, zodat er geen verwarring ontstaat. Lees je het anders, laat dan een berichtje achter in het ', guestbook('gastenboek'), '.'],
      ],
      sources: [
        { text: 'De Standaard, begrotingsgesprekken', href: SRC.standaard },
        { text: 'Nieuwsblad, voorstellen voor de begroting', href: SRC.nieuwsblad },
        { text: 'HLN, Vooruit over managementvennootschappen', href: SRC.hlnVooruit },
        { text: 'HLN, resultaten Club Brugge 2024-2025', href: SRC.hlnClub },
        { text: 'OESO, Taxing Wages 2026', href: SRC.oecdWages },
        { text: 'OESO, Revenue Statistics 2025', href: SRC.oecdRevenue },
        { text: 'Statbel, werkgelegenheid en werkloosheid', href: SRC.statbel },
      ],
    },
  },
  {
    slug: 'a-new-artwork',
    title: 'a new artwork',
    category: 'site-update',
    dateTime: '2026-10-30T12:50:00+01:00',
    dateLabel: '30 October 2026, 12:50 CET',
    author: 'Thành Lambeets',
    body: [
      [
        'I made a new ',
        { text: 'artwork', href: '/artwork?from=blog-links', kind: 'artwork' },
        '. You can find it at the top of the artwork page.',
      ],
    ],
  },
  {
    slug: 'a-few-small-changes',
    title: 'a few small changes',
    category: 'site-update',
    dateTime: '2026-10-30T12:46:00+01:00',
    dateLabel: '30 October 2026, 12:46 CET',
    author: 'Thành Lambeets',
    body: [
      [
        "I redid the works page. It's now a simple list with the year, context and type of each project, and hovering over a title shows a small preview. I also changed the guestbook and moved it here to the blog page. There's a new piece at the top of the artwork page, and the artwork videos are about a third of the size they were, so the page loads faster.",
      ],
    ],
  },
  {
    slug: 'one-land-many-boxes',
    title: 'one land, many boxes',
    category: 'opinion',
    topic: 'society',
    dateTime: '2026-10-29T14:30:00+01:00',
    dateLabel: '29 October 2026, 14:30 CET',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      [
        "This piece is about how people talk to each other, not about who has the right numbers. I came across ",
        { text: 'this post', href: SEPPE_POST_URL, kind: 'external' },
        " by chance while scrolling, and since I now have this blog as a place to write down what I think, I decided to use it. I picked this one on purpose. The post and both comments under it each had a clear side, and it looked like they had all done their research, but mostly to back up their own point. My first thought was: here we go again, everyone throwing numbers around and defending their own side. That made me curious about why it keeps happening, so I'm writing about it. I only read the post and these two comments, not the whole thread. I'm also not going to check every claim.",
      ],
      [
        "The post, by @seppedemeulder, reacts to a message from Prime Minister Bart De Wever on the anniversary of the Hamas attack on Israel. In the tweet, it can look as if the story starts on that day, and the post pushes back with a long list of Israeli attacks going back to the founding of Israel. Whether De Wever actually sees it that way, I honestly don't know. A tweet leaves a lot out, and I've never read his full view on the conflict. One commenter rejects the word genocide, says Israel also helped people in Gaza and warns readers not to believe the news. Another answers that he is the one who hasn't done his reading, blames Europe for the whole conflict and ends with a personal jab.",
      ],
      [
        "This is only my reading of a few short texts by people I don't know, but look past the tone and each of them wants something you can understand. The post seems to want Palestinian suffering to count as much as Israeli suffering. The first commenter seems afraid that Jews as a whole are being painted as the villain. The second one, as I read it, is saying that both peoples are paying for choices Europe made, but that gets lost in the insult.",
      ],
      [
        "This ties in with my earlier posts about boxes. In one short thread, people put each other in boxes: the ignorant one, the antisemite, and the labels that are left unsaid. Once someone is in a box, you don't have to listen anymore. Add confirmation bias, the habit of picking only the facts that suit your side, and a counterargument starts to feel like a personal attack. Meanwhile, a child in Gaza and a young person at a festival near the border both died for something they never chose.",
      ],
      [
        "So why can't they just live together? This is my own simple take, and the full history is a lot longer. In some places they do. Many of Israel's citizens are Arab-Palestinian, and in cities like Haifa and Jaffa, Jews and Arabs share the same streets. On a larger scale it fails because two peoples see the same land as home. For many Jews it is the one place they feel safe after centuries of persecution. For Palestinians it is where their families lived for generations, until many were driven out or fled. Fear does the rest, and hardliners on both sides get their support from it. People who actually meet each other often soften. What stands between them is mostly fear, and the people who use it.",
      ],
      [
        "I try to stand in the middle of discussions like this, recognising the pain on both sides and listening to what the other person actually says. That doesn't make every claim equally true. It just means hearing people out, because behind every argument in these threads there is a person.",
      ],
      ['If you read it differently, leave a note in the ', guestbook('guestbook'), '.'],
    ],
  },
  {
    slug: 'running-on-my-own',
    title: 'running on my own',
    category: 'site-update',
    dateTime: '2026-10-28T20:50:00+01:00',
    dateLabel: '28 October 2026, 20:50 CET',
    author: 'Thành Lambeets',
    body: [
      [
        'Hi, this site now runs on Vercel.',
      ],
    ],
  },
  {
    slug: 'a-follow-up',
    title: 'a follow-up',
    category: 'opinion',
    topic: 'society',
    dateTime: '2026-10-21T13:53:00+02:00',
    dateLabel: '21 October 2026, 13:53 CEST',
    author: 'Thành Lambeets',
    body: [
      [
        'A follow up to my last post. We see a few seconds on a screen and judge the behaviour, but we rarely know the intention behind it. Most protesters and most police officers are decent people. Sometimes firm action is needed. Unjustified violence never is, from any side...',
      ],
    ],
  },
  {
    slug: 'boxes-in-the-news',
    title: 'boxes in the news',
    category: 'opinion',
    topic: 'society',
    dateTime: '2026-10-21T12:11:00+02:00',
    dateLabel: '21 October 2026, 12:11 CEST',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      [
        "Is this still normal? Someone asked that while sharing a video of the riots in France, and it's where an ",
        { text: 'opinion piece', href: 'https://www.instagram.com/p/DeuA7_TjRX8/?img_index=4', kind: 'external' },
        " by @seppedemeulder on Instagram starts. It's a longer post than usual, because the piece needed the space.",
      ],
      [
        "The author says no, but says that's where the thinking should start, not end. Most people either get involved somehow or look away, and only a small group turns to looting and arson. He writes that the public debate leaves almost no room for context, and that anger without a political outlet will only grow.",
      ],
      [
        'He asks readers to do two things at once: condemn the violence and ask why it happens. He also looks at what comes after, when politicians and commentators use the riots to label their opponents or entire groups of people. After that, a real conversation gets a lot harder.',
      ],
      [
        "Count how many boxes show up in this one story: peaceful protesters and rioters, left and right, the people who condemn and the people who excuse. You can explain the context and still reject the violence. You can want firm policing and still want to understand what's going on.",
      ],
      ['Thanks to the author for writing it. If you read it differently, leave a note in the ', guestbook('guestbook'), '.'],
    ],
  },
  {
    slug: 'a-little-site-update',
    title: 'a little site update',
    category: 'site-update',
    dateTime: '2026-10-21T14:06:00+02:00',
    dateLabel: '21 October 2026, 14:06 CEST',
    author: 'Thành Lambeets',
    body: [
      ['Today I refined my job-search flowchart, guestbook, favicon and return buttons. I reorganised blog+links into scrollable site updates, opinion pieces, favourites and recent music, added three portfolio links and five album highlights, published an opinion follow-up, and reset the visitor counter to 116.'],
    ],
  },
  {
    slug: 'meet-my-job-search-agent',
    title: 'meet my job-search agent',
    category: 'site-update',
    dateTime: '2026-10-20T23:15:00+02:00',
    dateLabel: '20 October 2026, 23:15 CEST',
    author: 'Thành Lambeets',
    body: [
      [
        'I made a small AI agent to help with my job search. I designed and tested it, and it’s now in its test phase. Read more about it on the ',
        { text: 'agent page', href: '/works/vacature-agent?from=blog-links', kind: 'works' },
        ', or leave me a note in the ',
        guestbook('guestbook'),
        '.',
      ],
    ],
  },
  {
    slug: 'officially-live',
    title: 'it’s officially live!',
    category: 'site-update',
    dateTime: '2026-10-20T13:49:00+02:00',
    dateLabel: '20 October 2026, 13:49 CEST',
    author: 'Thành Lambeets',
    body: [
      ['My little corner of the internet is officially launched! A personal space for my projects, artwork, photography, music, and the things I like.'],
      ['All my edited photos are now on the website. You can explore them in ', { text: 'visualisations', href: '/visualisations?from=blog-links', kind: 'visualisations' }, '.'],
      ['I’ve also given the homepage a little more depth, with softer shadows, glassy reflections, and floating shapes. Take your time looking around, try a different colour theme, and leave a little hello in the ', guestbook('guestbook'), '. Thanks for visiting!'],
    ],
  },
  {
    slug: 'launch-day',
    title: 'launch day',
    category: 'site-update',
    dateTime: '2026-10-19T12:40:00+02:00',
    dateLabel: '19 October 2026, 12:40 CEST',
    author: 'Thành Lambeets',
    body: [
      ['Today is launch day! This version of my website is ready to help me find a job, while still leaving room for the things I love.'],
      ['Lately I’ve refined the about page and project layouts, made the site scale more consistently across screens, and improved the loading and ordering of my record collection — including a new Brian Eno addition.'],
      ['There are still lots of edited photos to add. I’m not quite sure about the works carousel yet, and I’d like to make the landing animation smoother. A beginning, not a finished thing.'],
    ],
  },
  {
    slug: 'a-little-music-update',
    title: 'a little music update',
    category: 'site-update',
    dateTime: '2026-10-13T23:13:00+02:00',
    dateLabel: '13 October 2026, 23:13 CEST',
    author: 'Thành Lambeets',
    body: [
      ['Today I added a music page and connected my Discogs collection, so you can browse the records I own. I put drum & bass and jungle near the top and kept the Good Looking catalogue together. I also worked on smoother entrance animations and tidied up the home navigation.'],
      ['There’s still a lot to do! I have plenty more visualisations and photos to add, and I’m still working on making a nice about me page. This little corner of the internet is slowly taking shape.'],
    ],
  },
  {
    slug: 'still-a-work-in-progress',
    title: 'still a work in progress',
    category: 'site-update',
    dateTime: '2026-10-09T17:49:00+02:00',
    dateLabel: '9 October 2026, 17:49 CEST',
    author: 'Thành Lambeets',
    body: [
      ['I still have a lot more pictures to add, and I’m working on their edits in Adobe Lightroom. I’m new to photo editing, so some of the pictures here aren’t quite where I want them yet. A few edits need another pass — I’m learning as I go.'],
      ['I’d also love to add a music player and make music part of the website. I’m still brainstorming how that could work, so there’s nothing final yet.'],
      ['Feedback is always welcome! If you have suggestions about the pictures or the website, leave a message in the ', guestbook('guestbook'), '.'],
    ],
  },
  {
    slug: 'a-little-introduction',
    title: 'a little introduction',
    category: 'site-update',
    dateTime: '2026-10-09T17:46:00+02:00',
    dateLabel: '9 October 2026, 17:46 CEST',
    author: 'Thành Lambeets',
    body: [
      ['I made this site as a little home for my work, art and things I like. It’s inspired by early-2000s web design and ', { text: 'Neocities', href: 'https://neocities.org/', kind: 'external' }, ': personal websites with their own character, little details and room to explore.'],
      [
        'Have a look through my ', { text: 'projects', href: '/works?from=blog-links', kind: 'works' }, ', ',
        { text: 'artwork', href: '/artwork?from=blog-links', kind: 'artwork' }, ' and ',
        { text: 'visualisations', href: '/visualisations?from=blog-links', kind: 'visualisations' }, ', get to know me on ',
        { text: 'about', href: '/about?from=blog-links', kind: 'about' }, ', or leave a message in the ',
        guestbook('guestbook'),
        '. Feel free to open the pictures, try the different colour themes and visit my favourite sites below.',
      ],
      ['I’ll share site updates and little bits of my life here too. More soon!'],
    ],
  },
];

export const sortedPosts = (): BlogPost[] =>
  [...BLOG_POSTS].sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime));
