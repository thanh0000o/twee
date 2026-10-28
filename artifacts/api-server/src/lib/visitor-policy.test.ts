import assert from "node:assert/strict";
import { test } from "node:test";
import { canRegisterVisitor } from "./visitor-policy";

const browser = {
  production: true,
  origin: "https://thanhlambeetstwee.com",
  fetchSite: "same-origin",
  userAgent: "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36",
};

test("only same-origin browsers on the published site can register", () => {
  assert.equal(canRegisterVisitor(browser), true);
  assert.equal(canRegisterVisitor({ ...browser, origin: "https://thanhlambeetstwee.replit.app" }), true);
  assert.equal(canRegisterVisitor({ ...browser, production: false }), false);
  assert.equal(canRegisterVisitor({ ...browser, origin: "https://preview.replit.dev" }), false);
  assert.equal(canRegisterVisitor({ ...browser, origin: undefined }), false);
  assert.equal(canRegisterVisitor({ ...browser, fetchSite: "cross-site" }), false);
  assert.equal(canRegisterVisitor({ ...browser, userAgent: undefined }), false);
});

test("recognised crawlers, screenshot browsers and command-line checks cannot register", () => {
  for (const userAgent of [
    "Mozilla/5.0 Chrome/130.0.0.0 Safari/537.36 Googlebot",
    "Mozilla/5.0 HeadlessChrome/130.0.0.0 Safari/537.36",
    "curl/8.0", "facebookexternalhit/1.1", "Lighthouse Chrome/130.0.0.0",
  ]) {
    assert.equal(canRegisterVisitor({ ...browser, userAgent }), false, userAgent);
  }
});
