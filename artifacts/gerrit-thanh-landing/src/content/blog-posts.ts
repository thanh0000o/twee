export type PostLinkKind = 'guestbook' | 'works' | 'artwork' | 'visualisations' | 'about' | 'external';
export type PostSegment =
  | string
  | { text: string; href: string; kind: PostLinkKind }
  | { text: string; kind: 'emphasis' };
export type PostParagraph = PostSegment[];
export type PostHeading = { heading: string };
export type PostBlock = PostParagraph | PostHeading;
export interface PostSource { text: string; href: string }

export interface BlogPost {
  slug: string;
  title: string;
  category: 'site-update' | 'opinion';
  dateTime: string;
  dateLabel: string;
  author: string;
  body: PostBlock[];
  sources?: PostSource[];
  nl?: { body: PostBlock[]; sources?: PostSource[] };
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
    slug: 'before-you-read',
    title: 'before you read',
    category: 'opinion',
    dateTime: '2026-11-17T17:40:00+01:00',
    dateLabel: '17 November 2026, 17:40 CET',
    author: 'Thành Lambeets',
    body: [
      ["Before you read my opinion pieces, I want to be honest about something: these are the first ones I've ever written. I'm not a journalist or an expert. I write about whatever keeps me busy, from philosophy and my own way of looking at things to culture, social issues and sometimes the news. Often it starts with a post, a conversation or a moment on TV that sticks with me and won't let go until I've read more about it."],
      ["When I write, I try to stay in the middle. I want to understand both sides and leave room for nuance, even when it feels like everyone online is shouting over each other. I don't always get it right, and I'm learning as I go. More pieces are coming."],
      ["If something isn't clear or you see it differently, I'd really like to hear it. Leave a note in the ", guestbook('guestbook'), '. Thanks for reading, and enjoy.'],
    ],
    nl: {
      body: [
        ["Voor je mijn opiniestukken leest, wil ik eerlijk iets zeggen: dit zijn de eerste die ik ooit geschreven heb. Ik ben geen journalist of expert. Ik schrijf over wat me bezighoudt, van filosofie en mijn eigen kijk op dingen tot cultuur, sociale thema's en soms het nieuws. Vaak begint het met een post, een gesprek of een moment op tv dat blijft hangen en me niet loslaat tot ik er meer over gelezen heb."],
        ['Als ik schrijf, probeer ik in het midden te blijven. Ik wil beide kanten begrijpen en ruimte laten voor nuance, ook als het online voelt alsof iedereen door elkaar roept. Dat lukt niet altijd, en ik leer al doende. Er komen er nog.'],
        ['Is iets niet duidelijk of zie je het anders, dan hoor ik dat echt graag. Laat een berichtje achter in het ', guestbook('gastenboek'), '. Bedankt om te lezen, en veel leesplezier.'],
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
    dateTime: '2026-10-29T14:30:00+01:00',
    dateLabel: '29 October 2026, 14:30 CET',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      [
        'I came across ',
        { text: 'this post', href: SEPPE_POST_URL, kind: 'external' },
        " by chance while scrolling, and since I now have this blog as a place to write down what I think, I decided to use it. I picked this one on purpose. The post and both comments under it each had a clear side, and it looked like they had all done their research, but mostly to back up their own point. My first thought was: here we go again, everyone throwing numbers around and defending their own side. That made me curious about why it keeps happening, so I'm writing about it. I only read the post and these two comments, not the whole thread. I'm also not going to check every claim. This post is about how people talk to each other, not about who has the right numbers.",
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
    dateTime: '2026-10-21T12:11:00+02:00',
    dateLabel: '21 October 2026, 12:11 CEST',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      [
        'I read an ',
        { text: 'opinion piece', href: 'https://www.instagram.com/p/DeuA7_TjRX8/?img_index=4', kind: 'external' },
        " by @seppedemeulder on Instagram about the unrest in France. It's a longer post than usual, because the piece needed the space.",
      ],
      [
        "It opens with someone sharing a video of the riots and asking if this is still normal. The author says no, but says that's where the thinking should start, not end. Most people either get involved somehow or look away, and only a small group turns to looting and arson. He writes that the public debate leaves almost no room for context, and that anger without a political outlet will only grow.",
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
