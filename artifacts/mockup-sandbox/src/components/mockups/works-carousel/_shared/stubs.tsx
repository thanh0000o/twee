import type { AnchorHTMLAttributes } from 'react';

// Routing stub: the sandbox has no router, so links are inert anchors.
export function Link({ href, replace: _replace, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; replace?: boolean }) {
  return <a href={href} onClick={(event) => { if (!event.defaultPrevented) event.preventDefault(); }} {...rest} />;
}

export const useBlogOrigin = () => false;
export const withBlogOrigin = (path: string, fromBlog: boolean) => (fromBlog ? `${path}?from=blog-links` : path);
export const getSavedPaletteFilter = () => 'none';
export function BlogReturnLink() { return null; }
