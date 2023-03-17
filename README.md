# littlexml

A small and simple XML builder for JavaScript/TypeScript.

[![npm](https://img.shields.io/npm/v/@shun-shobon/littlexml?logo=npm)](https://www.npmjs.com/package/@shun-shobon/littlexml)
[![deno](https://img.shields.io/github/v/release/shun-shobon/littlexml?label=deno&logo=deno)](https://deno.land/x/littlexml)
[![test](https://github.com/shun-shobon/littlexml/actions/workflows/test.yml/badge.svg)](https://github.com/shun-shobon/littlexml/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/shun-shobon/littlexml/branch/master/graph/badge.svg?token=VAZxHGjjpu)](https://codecov.io/gh/shun-shobon/littlexml)

## About

This library is designed to run on small JavaScript runtimes such as Cloudflare
Workers. It also works on Deno, Node.js, and browsers.

## Features

- Render XML as a string
- Render XML as a iterator
- Render XML as a stream (browser compatible Stream API)

## Support platforms

- Deno
- Node.js
- Browser
- Edge

## Installation

### Node.js

Install package from npm.

```sh
npm install @shun-shobon/littlexml
```

You can import from the package as `@shun-shobon/littlexml`.

```ts
import { element, renderToString } from "@shun-shobon/littlexml";
```

<!-- x-release-please-start-version -->

### Deno

You can directly import from `deno.land/x`.

```ts
import {
  element,
  renderToString,
} from "https://deno.land/x/littlexml@0.4.0/mod.ts";
```

### Browser

You can directly import from `unpkg.com`.

```js
import {
  element,
  renderToString,
} from "https://unpkg.com/@shun-shobon/littlexml@0.4.0";
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
          .child(element("image:caption").text("caption"))
      )
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
