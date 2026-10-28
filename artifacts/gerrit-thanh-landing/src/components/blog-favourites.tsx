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
    description: "A friend's portfolio.",
  },
  {
    id: 'kato',
    label: 'katovanroy.com',
    href: 'https://katovanroy.com/',
    description: "A friend's portfolio.",
  },
  {
    id: 'beanlette',
    label: 'beanlette.net',
    href: 'https://beanlette.net/',
    description: 'A favourite portfolio found on Instagram.',
  },
  {
    id: 'sergebrison',
    label: 'sergebrison.com',
    href: 'https://www.sergebrison.com/patrimmoine.html',
    description: 'A portfolio with beautiful photos.',
  },
  {
    id: 'lewimoors',
    label: 'lewimoors.com',
    href: 'https://lewimoors.com/',
    description: 'A 3D artist whose work I really admire.',
  },
  {
    id: 'thomsten',
    label: 'thomsten.com',
    href: 'https://thomsten.com/',
    description: 'A portfolio website I like.',
  },
];

const otherFavouriteLinks: FavouriteLink[] = [
  {
    id: 'solar',
    label: 'lowtechmagazine.com',
    href: 'https://solar.lowtechmagazine.com/power/',
    description: 'A solar-powered website.',
  },
  {
    id: 'winamp',
    label: 'Winamp Skin Museum',
    href: 'https://skins.webamp.org/',
    description: 'Browse skins for Winamp.',
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
