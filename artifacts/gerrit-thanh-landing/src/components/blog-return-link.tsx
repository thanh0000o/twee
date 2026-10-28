import { Link, useSearch } from 'wouter';
import { useSavedPalette } from '../hooks/use-saved-palette';
import './blog-return-link.css';

export function useBlogOrigin() {
  return new URLSearchParams(useSearch()).get('from') === 'blog-links';
}

export function withBlogOrigin(path: string, fromBlog: boolean) {
  return fromBlog ? `${path}${path.includes('?') ? '&' : '?'}from=blog-links` : path;
}

export function BlogReturnLink() {
  const fromBlog = useBlogOrigin();
  const palette = useSavedPalette();
  if (!fromBlog) return null;

  return (
    <Link
      href="/blog-links"
      className="subpage-return about-return blog-links-return"
      style={{ filter: palette.filter }}
      data-testid="link-return-blog-links"
    >
      {`{return blog+links}`}
    </Link>
  );
}
