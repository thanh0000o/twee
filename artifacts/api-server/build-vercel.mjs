// Bundles the API into one file inside the website's api/ folder, so Vercel
// can serve it as a serverless function next to the static site.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const apiDir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.resolve(apiDir, "src/vercel.ts")],
  outfile: path.resolve(apiDir, "../gerrit-thanh-landing/api/_server.mjs"),
  platform: "node",
  target: "node22",
  bundle: true,
  format: "esm",
  external: ["pg-native", "pino-pretty"],
  logLevel: "info",
  banner: {
    js: `import { createRequire as __cr } from 'node:module';
import __p from 'node:path';
import __u from 'node:url';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __u.fileURLToPath(import.meta.url);
globalThis.__dirname = __p.dirname(globalThis.__filename);`,
  },
});
