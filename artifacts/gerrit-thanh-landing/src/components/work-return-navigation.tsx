import { Link } from 'wouter';
import { BlogReturnLink, useBlogOrigin, withBlogOrigin } from './blog-return-link';
import './work-return-navigation.css';

export function WorkReturnNavigation({ filter }: { filter: string }) {
  const fromBlog = useBlogOrigin();
  return (
    <nav className="work-return-nav" aria-label="Project navigation">
      <Link href={withBlogOrigin('/works', fromBlog)} className="subpage-return about-return works-return" style={{ filter }} data-testid="link-return-works">
        {`{return works}`}
      </Link>
      <Link href="/" className="subpage-return about-return works-return" style={{ filter }} data-testid="link-return-home">
        {`{return home}`}
      </Link>
      <BlogReturnLink />
    </nav>
  );
}
