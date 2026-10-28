import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOG_POSTS, sortedPosts } from '../src/content/blog-posts.ts';

test('full posts retain unique identifiers, dates and complete paragraphs', () => {
  assert.equal(BLOG_POSTS.length, 6);
  assert.equal(new Set(BLOG_POSTS.map(post => post.slug)).size, 6);
  assert.deepEqual(BLOG_POSTS.map(post => post.body.length), [1, 3, 3, 2, 3, 3]);
  for (const post of BLOG_POSTS) {
    assert.ok(Number.isFinite(Date.parse(post.dateTime)));
    assert.match(post.dateTime, /T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    assert.match(post.dateLabel, /\d{1,2}:\d{2} (?:CEST|CET)$/);
    assert.equal(post.author, 'Thành Lambeets');
    assert.ok(post.body.every(paragraph => paragraph.length > 0));
  }
});

test('all posts are presented newest first without changing source content', () => {
  const sourceOrder = BLOG_POSTS.map(post => post.slug);
  assert.deepEqual(sortedPosts().map(post => post.slug), [
    'meet-my-job-search-agent', 'officially-live', 'launch-day', 'a-little-music-update',
    'still-a-work-in-progress', 'a-little-introduction',
  ]);
  assert.deepEqual(BLOG_POSTS.map(post => post.slug), sourceOrder);
});

test('job-search post links to its case study and the existing guestbook', () => {
  const post = BLOG_POSTS.find(({ slug }) => slug === 'meet-my-job-search-agent');
  assert.ok(post);
  assert.equal(post.title, 'meet my job-search agent');
  assert.equal(post.dateLabel, '20 October 2026, 23:15 CEST');
  assert.deepEqual(post.body.flat().filter(segment => typeof segment !== 'string').map(({ text, href }) => ({ text, href })), [
    { text: 'agent page', href: '/works/vacature-agent?from=blog-links' },
    { text: 'guestbook', href: '/guestbook?from=blog-links' },
  ]);
});

test('original internal blog-origin links and external Neocities link remain', () => {
  const links = BLOG_POSTS.flatMap(post => post.body.flat()).filter(segment => typeof segment !== 'string');
  assert.ok(links.some(link => link.href === 'https://neocities.org/'));
  for (const link of links.filter(link => link.kind !== 'external')) {
    assert.equal(new URL(link.href, 'https://example.com').searchParams.get('from'), 'blog-links');
  }
});
