import type { FC } from 'react';

type FavouriteLink = {
  id: string;
  label: string;
  href: string;
  description: string;
};

const portfolioLinks: FavouriteLink[] = [
  {
    id: 'linky',
    label: 'linky2001.com',
    href: 'https://linky2001.com/',
    description: 'A friend.',
  },
  {
    id: 'kato',
    label: 'katovanroy.com',
    href: 'https://katovanroy.com/',
    description: 'A friend.',
  },
  {
    id: 'beanlette',
    label: 'beanlette.net',
    href: 'https://beanlette.net/',
    description: 'Found on Instagram.',
  },
  {
    id: 'sergebrison',
    label: 'sergebrison.com',
    href: 'https://www.sergebrison.com/patrimmoine.html',
    description: 'Beautiful photos.',
  },
  {
    id: 'lewimoors',
    label: 'lewimoors.com',
    href: 'https://lewimoors.com/',
    description: '3D artist I admire.',
  },
  {
    id: 'thomsten',
    label: 'thomsten.com',
    href: 'https://thomsten.com/',
    description: 'A portfolio I like.',
  },
];

const otherFavouriteLinks: FavouriteLink[] = [
  {
    id: 'solar',
    label: 'lowtechmagazine.com',
    href: 'https://solar.lowtechmagazine.com/power/',
    description: 'Solar-powered.',
  },
  {
    id: 'winamp',
    label: 'Winamp Skin Museum',
    href: 'https://skins.webamp.org/',
    description: 'Old Winamp skins.',
  },
  {
    id: 'realroots',
    label: 'realrootsradio.net',
    href: 'https://realrootsradio.net/',
    description: 'Reggae and dub radio.',
  },
  {
    id: 'rinse',
    label: 'rinse.fm',
    href: 'https://www.rinse.fm/channels/uk',
    description: 'UK club radio.',
  },
  {
    id: 'kosmik',
    label: 'kosmik-dstroyer.top',
    href: 'https://kosmik-dstroyer.top/',
    description: 'Trip hop and jungle radio.',
  },
  {
    id: 'kwsx',
    label: 'radio.kwsx.online',
    href: 'https://radio.kwsx.online/',
    description: 'Internet radio.',
  },
];

const FavouriteLinkRow: FC<{ link: FavouriteLink }> = ({ link }) => (
  <p className="blog-site">
    <a
      className="blog-link-label"
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`link-favourite-${link.id}`}
    >
      {link.label}
    </a>
    : {link.description}
  </p>
);

export const BlogFavourites: FC = () => (
  <div className="blog-favourites">
    <p className="blog-buttons-hint">Click a link to visit its website.</p>
    <div className="blog-site-list">
      {portfolioLinks.map((link) => <FavouriteLinkRow key={link.id} link={link} />)}
      <p className="blog-site">
        <a
          className="blog-link-label"
          href="https://yesterweb.org/no-to-web3/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Say no to Web3 — Yesterweb (opens in a new tab)"
          data-testid="link-favourite-web3-roly"
        >
          Say no to Web3
        </a>
        {' / '}
        <a
          className="blog-link-label"
          href="https://yesterweb.org/no-to-web3/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="No Web3 — Yesterweb (opens in a new tab)"
          data-testid="link-favourite-web3-auzziejay"
        >
          No Web3
        </a>
        : Yesterweb campaign.
      </p>
      {otherFavouriteLinks.map((link) => <FavouriteLinkRow key={link.id} link={link} />)}
    </div>
  </div>
);
