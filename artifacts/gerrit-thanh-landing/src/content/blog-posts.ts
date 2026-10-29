export type PostLinkKind = 'guestbook' | 'works' | 'artwork' | 'visualisations' | 'about' | 'external';
export type PostSegment =
  | string
  | { text: string; href: string; kind: PostLinkKind }
  | { text: string; kind: 'emphasis' };
export type PostParagraph = PostSegment[];

export interface BlogPost {
  slug: string;
  title: string;
  category: 'site-update' | 'opinion';
  dateTime: string;
  dateLabel: string;
  author: string;
  body: PostParagraph[];
  wide?: boolean;
}

const SEPPE_POST_URL = 'https://www.instagram.com/seppedemeulder/';

const guestbook = (text: string): PostSegment => ({ text, href: '/guestbook?from=blog-links', kind: 'guestbook' });

export const BLOG_POSTS: BlogPost[] = [
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
        "I read an ",
        { text: 'opinion piece', href: 'https://www.instagram.com/p/DeuA7_TjRX8/?img_index=4', kind: 'external' },
        " by @seppedemeulder on Instagram about the unrest in France. This post is longer than usual, but I wanted to give it the space.",
      ],
      [
        'The piece starts with someone sharing a video of the riots and asking if this is still normal. The author says no, and then argues that this answer is where the thinking should start. Most people get involved in some way or look away. A small minority turns to looting and arson. According to the author, the public debate leaves almost no room for the wider context, and anger that has no political outlet will keep growing.',
      ],
      [
        'The author asks readers to do two things at once: condemn the violence and ask why it happens. The piece also looks at what comes after, when politicians and commentators use the violence to label their opponents or whole groups of people. That makes a real discussion a lot harder.',
      ],
      [
        "This connects to my last post about boxes. Count how many show up in this one story: peaceful protesters and rioters, left and right, the people who condemn and the people who excuse. You can explain the context and still reject the violence, and you can want firm policing and still want to understand what's going on.",
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
