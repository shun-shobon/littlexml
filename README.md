# littlexml

A small and simple XML builder for JavaScript/TypeScript.

## About

This library is designed to run on small JavaScript runtimes such as Cloudflare Workers.
It also works on Deno, Node.js, and browsers.

## Support platforms

- [x] Deno
- [ ] Node.js
- [ ] Browser
- [ ] Edge

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
