# @shun-shobon/littlexml

1kB XML library for Node.js, Bun, Deno, Browser, Edge runtime.

[![npm](https://img.shields.io/npm/v/@shun-shobon/littlexml?logo=npm)](https://www.npmjs.com/package/@shun-shobon/littlexml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@shun-shobon/littlexml)](https://bundlephobia.com/package/@shun-shobon/littlexml)
[![test](https://github.com/shun-shobon/littlexml/actions/workflows/check.yml/badge.svg)](https://github.com/shun-shobon/littlexml/actions/workflows/check.yml)
[![codecov](https://codecov.io/gh/shun-shobon/littlexml/branch/master/graph/badge.svg?token=VAZxHGjjpu)](https://codecov.io/gh/shun-shobon/littlexml)

## About

This library is designed to run on small JavaScript runtimes such as Cloudflare
Workers. It also works on Node.js, Bun, Deno, and browsers.

## Features

- Render XML as a string, iterator, or stream.
- Render XML with indentation.

## Support platforms

- Node.js
- Deno
- Bun
- Browser
- Edge runtime like Cloudflare Workers, Vercel Edge Functions

## Installation

### Node.js / Bun

Install package from npm. You can also use yarn/pnpm instead of npm.
If you are using Bun, you can install with `bun add` command.

```sh
npm install @shun-shobon/littlexml
```

You can import from the package as `@shun-shobon/littlexml`.

```ts
import { element, renderToString } from "@shun-shobon/littlexml";
```

<!-- x-release-please-start-version -->

### Deno

You can directly import from `npm:@shun-shobon/littlexml`.

```ts
import { element, renderToString } from "npm:littlexml@0.5.0";
```

### Browser

You can directly import from `unpkg.com`.

```js
import {
	element,
	renderToString,
} from "https://unpkg.com/@shun-shobon/littlexml@0.5.0";
```

<!-- x-release-please-end -->

## Example

This example is rendering a sitemap.

```typescript
import { element, renderToString } from "@shun-shobon/littlexml";

const root = element("urlset")
	.attr("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
	.attr("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
	.child(
		element("url")
			.child(element("loc").text("https://example.com/"))
			.child(element("lastmod").text("2020-01-01"))
			.child(element("changefreq").text("daily"))
			.child(element("priority").text("0.8"))
			.child(
				element("image:image")
					.child(element("image:loc").text("https://example.com/image.png"))
					.child(element("image:caption").text("caption")),
			),
	);

const xml = renderToString(root, { version: "1.0", indent: 2 });

console.log(xml);
```

console output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2020-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://example.com/image.png</image:loc>
      <image:caption>caption</image:caption>
    </image:image>
  </url>
</urlset>
```
