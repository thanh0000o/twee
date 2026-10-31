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
    slug: 'who-carries-the-load',
    title: 'a fair share',
    category: 'opinion',
    dateTime: '2026-10-30T15:40:00+01:00',
    dateLabel: '30 October 2026, 15:40 CET',
    author: 'Thành Lambeets',
    wide: true,
    body: [
      ['The question on my mind lately is simple: who pays the bill in Belgium, and is it shared fairly?'],
      ["I started thinking about it because of the budget talks of the De Wever government and an episode of De Afspraak with Bart Verhaeghe, the chairman of Club Brugge. Online you mostly see angry reactions from both sides. I wanted to look past the slogans and understand what is actually on the table, and why people see it so differently. This is what I learned, and where I stand."],
      { heading: "what's on the table" },
      ['The federal government still has to find around 10 billion euros by 2029 to stay within the European budget rules. The five parties have been arguing for weeks about where that money should come from (', ext('De Standaard', SRC.standaard), ').'],
      ['Two things caught my eye. The first is flexi-jobs: if you already work at least four-fifths or are retired, you can earn extra without paying tax or social contributions yourself. The employer pays 28 percent. The system started in 2015 in hospitality, has been open to every sector since this year, and the tax-free ceiling went from 12,000 to 18,000 euros a year. Last year more than 250,000 people had a flexi-job (', ext('VRT', SRC.vrt), ').'],
      ['The second is management companies. A self-employed person, consultant or manager invoices through their own company instead of as a person. The company pays 20 to 25 percent corporate tax, and the money later comes out in a cheaper way than a normal salary. Vooruit estimates the state misses out on 4.2 to 4.7 billion euros a year because of it (', ext('HLN', SRC.hlnVooruit), ').'],
      ['On top of that there is a possible VAT increase from 21 to 22 percent. Four of the five parties are for it, MR is against (', ext('Nieuwsblad', SRC.nieuwsblad), ').'],
      { heading: 'my first reaction, and what I had to adjust' },
      ["My first thought was: big companies and big fortunes earn enough. They already avoid a lot of tax, do it again through management companies, and flexi-jobs take jobs away from people who just want to work. Why not look for the money there?"],
      ['Once I looked into it, I had to adjust a few things.'],
      ["Management companies are legal. It's called tax avoidance: people use the rules as they are written. Tax evasion, like hiding income, is something else and is a crime. If you want to change it, politics has to change the rules."],
      ['The people who have one are usually not multinationals or millionaires. They are often one-person companies of doctors, lawyers, consultants and IT people. People who earn well, but a different group than I had in mind.'],
      ['Flexi-jobs are mostly used by small businesses: cafés, bakeries, caterers, shops. And flexi-jobbers already have a job or are retired. Whether they really push out normal jobs, nobody knows for sure, because the data is missing. Economist Stijn Baert sees little of it, while Ive Marx is more worried. What is clear is that social security misses out on income: around 130 million euros a year now, and close to 480 million by 2029 according to the think tank Minerva (', ext('VRT', SRC.vrt), ').'],
      ["I also wondered why we don't simply tax money that leaves Belgium. Part of that already happens: there is withholding tax on dividends going abroad, an exit tax, rules against shifting profits to tax havens, and since 2024 a European minimum tax of 15 percent for large multinationals. Going much further is hard, because free movement of capital is a basic EU rule and countries compete for companies. It mostly works when countries get stricter together. That 15 percent took more than 130 countries years of negotiating."],
      { heading: 'the other side, looked at honestly' },
      ['MR, and partly N-VA, start from a different idea. According to them, too few people work in Belgium, and that is the real problem.'],
      ['Labour is taxed more heavily here than in almost any other rich country (', ext('OECD', SRC.oecdWages), "). So employers are slower to hire, and people who want to work more keep too little of it. If you lower those taxes, they say, more jobs follow, and people who work pay tax and don't need benefits. That way the measure partly pays for itself. For the same reason they are against new taxes on companies or a higher VAT, and would rather cut spending."],
      ["Flexi-jobs fit that logic. A bakery can quickly bring in extra hands when it's busy, and someone who already works can earn a bit more. Unizo says that for many small business owners it makes the difference between serving customers or turning them away."],
      ['I also understand the argument about companies better now. An entrepreneur takes risks without the protection an employee has: a smaller pension, less of a safety net when ill. Many self-employed people see their management company as a way to cover that themselves. To them it does not feel like taking advantage. And whoever reinvests their profit creates jobs. Tax that harder, and they might invest less or leave.'],
      ['What struck me: greed is usually not what drives them. People on that side have a different idea of what is fair, and look mainly at what someone earned and risked themselves.'],
      { heading: 'what Bart Verhaeghe says, and what holds up' },
      ["In De Afspraak, Verhaeghe put the entrepreneurs' side sharply: no more new taxes, a more efficient government on the Swiss model, and fewer workers paying for too many people who don't work. I checked three of his claims."],
      ["'Club Brugge pays 20 percent of its turnover to the state.' I can't check that. According to its accounts, the club made 25.7 million euros profit in 2024-2025, and 18.1 million was left after tax (", ext('HLN', SRC.hlnClub), "). So corporate tax was around 7.6 million. To reach 20 percent of turnover, he has to count social contributions and the tax withheld on wages too. That last part is really the players' own tax. And a football club with high wages is not a normal small business."],
      ["'We are the world champion in taxes.' For labour, that's true: according to the OECD, Belgium has the highest tax on wages of all 38 member countries, 52.5 percent for a single person on an average wage (", ext('OECD', SRC.oecdWages), '). If you look at all taxes together compared to the economy, Belgium was at 42.6 percent in 2024. Denmark (45.2), France (43.5), Austria (43.4) and Italy (42.7) were higher (', ext('OECD', SRC.oecdRevenue), '). So high, yes, but not the highest. Switzerland, his example, is at 27.2 percent.'],
      ["'There are more inactive people than active ones.' That's only true if you count children, students and pensioners, and then it goes for almost every country. Of people aged 20 to 64, 72.8 percent work (", ext('Statbel', SRC.statbel), '), and 77.3 percent in Flanders. The government wants 80 percent. So there is a problem, but the balance is less lopsided than his sentence suggests.'],
      ["On the heavy taxes on labour, he's right. His other numbers stretch things a bit."],
      { heading: 'where I stand' },
      ["I still want a fairer split of the load, even now that I understand the other side better."],
      ["We live in a capitalist society, and that's fine in itself. But not everyone gets the chance to start a business, and not everyone wants to. Most people just want a decent life, with a steady job and some breathing room at the end of the month. A society has to work for them too, even if they never start a business."],
      ["That idea is basically what Belgian social security is built on. Those who are stronger carry more, so those who are weaker don't fall. Anyone who succeeds also owes that to what society around them makes possible: education, roads, healthy workers, legal certainty."],
      ["So I think it's a shame that the bill now threatens to land mostly on ordinary workers and sick people, while setups like management companies and an ever wider flexi-job system leave contributions on the table. Someone doing exactly the same work next to a flexi-jobber does pay full tax. That doesn't feel fair."],
      ["Now that we have a budget deficit, I think people who have it easier can contribute a bit more for a while than the average middle-class person. Good for you if you can buy a Porsche, but you feel an extra contribution far less than a family that has to count every euro each month. A VAT increase hits everyone, and weighs most on people who spend almost all their income on ordinary things."],
      ["I see it like this: instead of ten houses you can, so to speak, buy nine. It's about a contribution based on what you can carry in hard times. Punishing entrepreneurs is never the point. Nobody is against entrepreneurs. The idea is just that everyone chips in."],
      ["Entrepreneurs say they reinvest their profit in machines and jobs. That they create jobs is good. But does that reinvesting happen enough? Part of the profit goes back into the company, part goes to dividends, and that differs a lot per company. Verhaeghe himself said the number of machines in Belgian factories is going down. So I'd like to see that argument proven first."],
      ["What strikes me most in this debate is that both sides feel caricatured. One side hears that it's against entrepreneurs. Entrepreneurs hear that they're freeloaders with a swimming pool, and feel treated like villains. That's where the conversation gets stuck. I try to stick to the question: a temporary, fair contribution based on what people can carry, and proof that profit really ends up in jobs and investment."],
      ["But I don't want to make it too simple either. Scrapping flexi-jobs hits exactly the small business owners, the bakery and the café. And if you talk about big fortunes, you should really be talking about a wealth or capital gains tax, not about the consultant with a one-person company."],
      { heading: 'questions I still have' },
      ["Where the truth lies depends on how big you think the effects are, and economists don't agree on that themselves. A few questions stay with me."],
      ['How many jobs does a tax cut on labour really create, and does it ever fully pay for itself? Usually only partly, from what I read.'],
      ['How much of their profit do Belgian companies really reinvest in machines and jobs, and how much goes to dividends?'],
      ['Can you tackle management companies without punishing small self-employed people who have no safety net?'],
      ['How do you keep flexi-jobs for the bakery and the café without the system turning into a way to make normal jobs cheaper?'],
      ['And if Belgium alone can do little about money leaving the country, will this government dare to push in Europe for stricter rules, like a minimum rate higher than 15 percent?'],
      ["I don't have an answer to most of those questions. I do stick with what I think: anyone who just wants a decent life should get the chance to have one."],
      ['If you read it differently, leave a note in the ', guestbook('guestbook'), '.'],
    ],
    sources: [
      { text: 'De Standaard, budget talks', href: SRC.standaard },
      { text: 'Nieuwsblad, flexi-jobs and the budget', href: SRC.nieuwsblad },
      { text: 'VRT NWS, flexi-jobs and the experts', href: SRC.vrt },
      { text: 'HLN, Vooruit on management companies', href: SRC.hlnVooruit },
      { text: 'HLN, Club Brugge results 2024-2025', href: SRC.hlnClub },
      { text: 'OECD, Taxing Wages 2026', href: SRC.oecdWages },
      { text: 'OECD, Revenue Statistics 2025', href: SRC.oecdRevenue },
      { text: 'Statbel, employment and unemployment', href: SRC.statbel },
    ],
    nl: {
      body: [
        ['De vraag die me de laatste tijd bezighoudt is simpel: wie betaalt in België de rekening, en is dat eerlijk verdeeld?'],
        ['Ik begon erover na te denken door het begrotingsdebat van de regering-De Wever en een aflevering van De Afspraak met Bart Verhaeghe, de voorzitter van Club Brugge. Online lees je vooral boze reacties van beide kanten. Ik wilde verder kijken dan de slogans en begrijpen wat er echt op tafel ligt, en waarom mensen er zo verschillend over denken. Dit is wat ik ervan geleerd heb, en waar ik zelf sta.'],
        { heading: 'wat er op tafel ligt' },
        ["De federale regering moet tegen 2029 nog zo'n 10 miljard euro vinden om binnen de Europese begrotingsregels te blijven. Over waar dat geld vandaan moet komen, zijn de vijf partijen het al weken oneens (", ext('De Standaard', SRC.standaard), ').'],
        ['Twee dossiers vallen me op. Het eerste zijn de flexi-jobs: wie al minstens viervijfde werkt of op pensioen is, kan bijverdienen zonder zelf belastingen of sociale bijdragen te betalen. De werkgever betaalt 28 procent. Het systeem begon in 2015 in de horeca, staat sinds dit jaar open voor alle sectoren, en het belastingvrije plafond ging van 12.000 naar 18.000 euro per jaar. Vorig jaar werkten meer dan 250.000 mensen als flexi-jobber (', ext('VRT', SRC.vrt), ').'],
        ['Het tweede zijn de managementvennootschappen. Een zelfstandige, consultant of manager factureert dan via zijn eigen vennootschap in plaats van als persoon. Die vennootschap betaalt 20 tot 25 procent vennootschapsbelasting, en het geld komt er later op een gunstigere manier uit dan een gewoon loon. Vooruit schat dat de staat daardoor 4,2 tot 4,7 miljard euro per jaar misloopt (', ext('HLN', SRC.hlnVooruit), ').'],
        ['Daartussen ligt nog een mogelijke btw-verhoging van 21 naar 22 procent, waar vier van de vijf partijen voor zijn en de MR tegen (', ext('Nieuwsblad', SRC.nieuwsblad), ').'],
        { heading: 'mijn eerste reactie, en wat ik moest bijstellen' },
        ['Mijn eerste gedachte was: grote vennootschappen en grote vermogens verdienen genoeg. Ze ontwijken al veel belastingen, doen dat nog eens via managementvennootschappen, en flexi-jobs pakken dan ook nog jobs af van mensen die gewoon willen werken. Waarom zoeken we het geld niet daar?'],
        ['Toen ik me erin verdiepte, moest ik een paar dingen nuanceren.'],
        ['Managementvennootschappen zijn legaal. Het heet belastingontwijking: mensen gebruiken de regels zoals ze geschreven zijn. Ontduiking, zoals inkomsten verzwijgen, is iets anders en wel strafbaar. Wil je dat veranderen, dan moet de politiek de regels aanpassen.'],
        ["Wie zo'n vennootschap heeft, is meestal geen multinational of miljonair. Het gaat vaak om eenmanszaken van artsen, advocaten, consultants en IT'ers. Goed verdienende mensen, maar een andere groep dan ik in mijn hoofd had."],
        ["Flexi-jobs worden vooral gebruikt door kleine zaken: cafés, bakkers, traiteurs, winkels. En flexi-jobbers werken al of zijn gepensioneerd. Of ze echt jobs verdringen, weet niemand precies, omdat de gegevens ontbreken. Econoom Stijn Baert ziet weinig verdringing, Ive Marx is er bezorgder over. Wel duidelijk is dat de sociale zekerheid inkomsten misloopt: nu zo'n 130 miljoen euro per jaar, en volgens denktank Minerva tegen 2029 bijna 480 miljoen (", ext('VRT', SRC.vrt), ').'],
        ['Ik vroeg me ook af waarom we geld dat uit België wegvloeit niet gewoon belasten. Dat gebeurt deels al: er is roerende voorheffing op dividenden naar het buitenland, een exitheffing, regels tegen winstverschuiving naar belastingparadijzen, en sinds 2024 een Europese minimumbelasting van 15 procent voor grote multinationals. Veel verder gaan is moeilijk, omdat vrij verkeer van kapitaal een basisregel van de EU is en landen met elkaar concurreren om bedrijven. Echte vooruitgang lukt vooral als landen samen strenger worden, zoals bij die 15 procent, waar meer dan 130 landen jaren over onderhandelden.'],
        { heading: 'de andere kant eerlijk bekeken' },
        ['MR, en deels N-VA, vertrekken van een ander idee. Volgens hen werken er in België gewoon te weinig mensen, en daar zit het echte probleem.'],
        ['Arbeid wordt hier zwaarder belast dan in bijna alle andere rijke landen (', ext('OESO', SRC.oecdWages), '). Daardoor nemen werkgevers minder snel iemand aan, en blijft er voor wie meer wil werken netto te weinig over. Als je de lasten verlaagt, komen er volgens hen meer jobs, en wie werkt betaalt belastingen en trekt geen uitkering. Zo verdient de maatregel zichzelf deels terug. Om dezelfde reden zijn ze tegen nieuwe belastingen op vennootschappen of een hogere btw, en besparen ze liever op uitgaven.'],
        ['Flexi-jobs passen in die logica. Een bakker kan in drukke periodes snel extra handen inzetten, en wie al werkt kan iets bijverdienen. Unizo zegt dat het voor veel kleine ondernemers het verschil maakt tussen klanten bedienen of moeten weigeren.'],
        ['Ook het argument over vennootschappen begrijp ik nu beter. Een ondernemer neemt risico, zonder de bescherming van een werknemer: minder pensioen, minder vangnet bij ziekte. Veel zelfstandigen zien hun managementvennootschap als een manier om dat zelf op te vangen. Profiteren is voor hen het verkeerde woord. En wie zijn winst herinvesteert, schept jobs. Belast je dat zwaarder, dan investeren ze misschien minder of gaan ze naar het buitenland.'],
        ['Wat me daarbij opviel: hebzucht is meestal niet de drijfveer. Mensen aan die kant hebben een ander idee van wat eerlijk is, en kijken vooral naar wat iemand zelf verdiend en geriskeerd heeft.'],
        { heading: 'wat Bart Verhaeghe zegt, en wat ervan klopt' },
        ['In De Afspraak verwoordde Verhaeghe de ondernemerskant scherp: geen nieuwe belastingen meer, een efficiëntere overheid naar Zwitsers voorbeeld, en minder werkenden die de rekening betalen voor te veel niet-werkenden. Ik heb drie van zijn beweringen nagekeken.'],
        ["'Club Brugge betaalt 20 procent van zijn omzet aan de staat.' Dat kan ik niet controleren. Volgens de jaarrekening maakte de club in 2024-2025 25,7 miljoen euro winst, waarvan na belastingen 18,1 miljoen overbleef (", ext('HLN', SRC.hlnClub), '). De vennootschapsbelasting was dus ongeveer 7,6 miljoen. Om aan 20 procent van de omzet te komen, moet hij ook de sociale bijdragen en de bedrijfsvoorheffing op de lonen meetellen. Die laatste is eigenlijk de belasting van de spelers zelf. En een voetbalclub met hoge lonen is geen gewone kmo.'],
        ["'We zijn de kampioen van de wereld in lasten.' Voor arbeid klopt dat: België heeft volgens de OESO de hoogste belastingdruk op lonen van alle 38 lidstaten, 52,5 procent voor een alleenstaande met een gemiddeld loon (", ext('OESO', SRC.oecdWages), '). Kijk je naar alle belastingen samen tegenover de economie, dan zat België in 2024 op 42,6 procent. Denemarken (45,2), Frankrijk (43,5), Oostenrijk (43,4) en Italië (42,7) lagen hoger (', ext('OESO', SRC.oecdRevenue), '). Hoog dus, maar geen wereldkampioen. Zwitserland, zijn voorbeeld, zit op 27,2 procent.'],
        ["'Er zijn meer niet-actieven dan actieven.' Dat klopt alleen als je kinderen, studenten en gepensioneerden meetelt, en dan geldt het in bijna elk land. Van de mensen tussen 20 en 64 werkt 72,8 procent (", ext('Statbel', SRC.statbel), '), in Vlaanderen 77,3 procent. De regering wil naar 80 procent. Er is dus wel een probleem, maar de verhouding is minder scheef dan zijn zin doet vermoeden.'],
        ['Over de zware lasten op arbeid heeft hij gelijk. Met de andere cijfers rekt hij de werkelijkheid wat op.'],
        { heading: 'waar ik sta' },
        ['Ik sta achter een eerlijkere verdeling van de lasten, ook nu ik de andere kant beter begrijp.'],
        ['We leven in een kapitalistische samenleving, en dat is op zich oké. Maar niet iedereen heeft de kans om een bedrijf te starten, en niet iedereen wil dat. De meeste mensen willen gewoon een degelijk leven, met een vaste job en wat ademruimte op het einde van de maand. Een samenleving moet ook voor hen werken, ook als ze nooit een bedrijf starten.'],
        ['Dat idee zit eigenlijk in de kern van de Belgische sociale zekerheid. Wie sterker staat, draagt meer, zodat wie zwakker staat niet valt. Wie succes heeft, dankt dat ook aan wat de samenleving rondom hem mogelijk maakt: onderwijs, wegen, gezonde werknemers, rechtszekerheid.'],
        ['Ik vind het daarom jammer dat de factuur nu vooral bij gewone werknemers en zieken terecht dreigt te komen, terwijl constructies als managementvennootschappen en een steeds ruimer flexi-jobsysteem bijdragen laten liggen. Iemand die naast een flexi-jobber exact hetzelfde werk doet, betaalt wel volle belastingen. Dat voelt niet eerlijk.'],
        ['Nu we in een begrotingstekort zitten, vind ik dat wie het makkelijker heeft even meer kan bijdragen dan de gewone middenklasser. Het is goed en leuk dat je een Porsche kunt kopen, maar je voelt een extra bijdrage veel minder dan een gezin dat elke maand moet rekenen. Een btw-verhoging treft iedereen, en weegt het zwaarst bij wie bijna zijn hele inkomen uitgeeft aan gewone aankopen.'],
        ['Ik zie het zo: in plaats van tien huizen kun je er bij wijze van spreken nog negen kopen. Het gaat om een bijdrage naar draagkracht in moeilijke tijden. Ondernemen afstraffen is nooit de bedoeling. Niemand is tegen ondernemers. Het idee is gewoon dat iedereen meedraagt.'],
        ['Ondernemers zeggen dat ze hun winst herinvesteren in machines en jobs. Dat ze jobs scheppen, is goed. Maar gebeurt dat herinvesteren ook genoeg? Een deel van de winst gaat terug naar het bedrijf, een deel naar dividenden, en dat verschilt sterk per bedrijf. Verhaeghe zei zelf dat het aantal machines in Belgische fabrieken daalt. Dat argument wil ik dus eerst zien bewezen worden.'],
        ['Wat me in dit debat het meest opvalt, is dat beide kanten zich gekarikaturiseerd voelen. De ene kant hoort dat ze tegen ondernemers is. Ondernemers horen dat ze profiteurs met een zwembad zijn, en voelen zich behandeld als schurk. Daar loopt het gesprek vast. Ik probeer zelf bij de vraag te blijven: een tijdelijke, eerlijke bijdrage naar draagkracht, en bewijs dat winst echt in jobs en investeringen terechtkomt.'],
        ['Maar ik wil het ook niet te simpel maken. Flexi-jobs schrappen treft net de kleine zelfstandigen, de bakker en het café. En wie het over grote vermogens heeft, moet eigenlijk praten over een vermogens- of meerwaardebelasting, niet over de consultant met een eenmanszaak.'],
        { heading: 'vragen die ik nog heb' },
        ['Waar de waarheid ligt, hangt af van hoe groot je de effecten inschat, en daar zijn economen het zelf niet over eens. Een paar vragen blijven bij mij hangen.'],
        ['Hoeveel jobs creëert een lastenverlaging echt, en betaalt ze zichzelf ooit volledig terug? Meestal maar gedeeltelijk, lees ik.'],
        ['Hoeveel van hun winst herinvesteren Belgische bedrijven echt in machines en jobs, en hoeveel gaat naar dividenden?'],
        ['Kun je managementvennootschappen aanpakken zonder kleine zelfstandigen te straffen die geen vangnet hebben?'],
        ['Hoe houd je flexi-jobs voor de bakker en het café, zonder dat het systeem uitgroeit tot een manier om gewone banen goedkoper te maken?'],
        ['En als België alleen weinig kan doen tegen geld dat wegvloeit, durft deze regering dan in Europa te pleiten voor strengere afspraken, zoals een hoger minimumtarief dan 15 procent?'],
        ['Op de meeste van die vragen heb ik geen antwoord. Ik blijf wel bij wat ik vind: wie gewoon een degelijk leven wil, moet daar ook de kans toe krijgen.'],
        ['Lees je het anders, laat dan een berichtje achter in het ', guestbook('gastenboek'), '.'],
      ],
      sources: [
        { text: 'De Standaard, begrotingsgesprekken', href: SRC.standaard },
        { text: 'Nieuwsblad, flexi-jobs en de begroting', href: SRC.nieuwsblad },
        { text: 'VRT NWS, flexi-jobs volgens experts', href: SRC.vrt },
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
