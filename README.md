# @shun-shobon/littlexml

Tiny XML library (~1.3kB min+gzip) for Node.js, Bun, Browser, Edge runtime.

[![npm](https://img.shields.io/npm/v/@shun-shobon/littlexml?logo=npm)](https://www.npmjs.com/package/@shun-shobon/littlexml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@shun-shobon/littlexml)](https://bundlephobia.com/package/@shun-shobon/littlexml)
[![ci](https://github.com/shun-shobon/littlexml/actions/workflows/ci.yml/badge.svg)](https://github.com/shun-shobon/littlexml/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/shun-shobon/littlexml/branch/master/graph/badge.svg?token=VAZxHGjjpu)](https://codecov.io/gh/shun-shobon/littlexml)

## About

This library is designed to run on small JavaScript runtimes such as Cloudflare
Workers. It also works on Node.js, Bun, and browsers.

## Features

- Render XML as a string, iterator, string stream, or UTF-8 byte stream.
- Render XML with indentation.
- Mixed content (text and child elements in any order).
- CDATA sections, comments, and processing instructions such as
  `<?xml-stylesheet?>`.
- Optional XML declaration for fragments such as inline SVG.
- Conditional children (`null`, `undefined`, and `false` are ignored) and
  nested arrays of children.
- JSX runtime.

## Support platforms

- Node.js
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

### Browser

You can directly import from `unpkg.com`.

```js
import { element, renderToString } from "https://unpkg.com/@shun-shobon/littlexml@latest";
```

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

### RSS with CDATA and a stylesheet

Pass an array to render processing instructions or comments before the root
element. `cdata()` splits `]]>` in the content so the output is always valid.

```typescript
import { cdata, element, instruction, renderToString } from "@shun-shobon/littlexml";

const posts = [{ title: "Hello", url: "https://example.com/hello", html: "<p>Hi!</p>" }];

const rss = element("rss")
	.attr("version", "2.0")
	.child(
		element("channel")
			.child(element("title").text("My Blog"))
			.child(
				posts.map((post) =>
					element("item")
						.child(element("title").text(post.title))
						.child(element("link").text(post.url))
						.child(element("description").child(cdata(post.html))),
				),
			),
	);

const xml = renderToString(
	[instruction("xml-stylesheet", 'type="text/xsl" href="/rss.xsl"'), rss],
	{
		indent: 2,
	},
);
```

console output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <item>
      <title>Hello</title>
      <link>https://example.com/hello</link>
      <description><![CDATA[<p>Hi!</p>]]></description>
    </item>
  </channel>
</rss>
```

`comment(text)` creates `<!--text-->`.

Input that would produce invalid XML throws `TypeError`: element, attribute and
processing instruction target names that are not XML names, characters not
allowed in XML 1.0 (such as `\0` or lone surrogates), `--` in a comment, and
`?>` in a processing instruction.

### Mixed content and inline SVG

Text and child elements can be mixed in any order with `text()` and `child()`
(a string passed to `child()` is a text node). Falsy children are ignored, and
attribute values can be numbers or booleans. Set `declaration: false` to render
a fragment.

```typescript
import { element, renderToString } from "@shun-shobon/littlexml";

const showLabel = true;

const svg = element("svg")
	.attr("xmlns", "http://www.w3.org/2000/svg")
	.attr("width", 100)
	.attr("height", 100)
	.child(
		element("circle").attr("cx", 50).attr("cy", 50).attr("r", 40),
		showLabel &&
			element("text")
				.attr("x", 10)
				.attr("y", 55)
				.text("Hello, ")
				.child(element("tspan").attr("font-weight", "bold").text("SVG"))
				.text("!"),
	);

const html = renderToString(svg, { declaration: false, indent: 2 });
```

console output:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <circle cx="50" cy="50" r="40"/>
  <text x="10" y="55">Hello, <tspan font-weight="bold">SVG</tspan>!</text>
</svg>
```

When indentation is enabled, the content of an element that contains text
(including CDATA) is rendered as is without indentation, because added
whitespace would change the text.

### JSX

The package also provides a JSX runtime. Enable it in `tsconfig.json`:

```json
{
	"compilerOptions": {
		"jsx": "react-jsx",
		"jsxImportSource": "@shun-shobon/littlexml"
	}
}
```

Or enable it for a single file with a pragma comment:

```tsx
/** @jsxImportSource @shun-shobon/littlexml */
```

```tsx
import { cdata, renderToString } from "@shun-shobon/littlexml";

const Url = ({ loc }: { loc: string }) => (
	<url>
		<loc>{loc}</loc>
	</url>
);

const root = (
	<urlset
		xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
		xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	>
		{pages.map((page) => (
			<Url loc={page.url} />
		))}
		{showTop && <Url loc="https://example.com/" />}
		<description>{cdata(html)}</description>
	</urlset>
);

const xml = renderToString(root, { indent: 2 });
```

- Any tag and attribute name is accepted, including namespaced names such as
  `<image:loc>` and `xmlns:image`. Invalid names and characters throw
  `TypeError` as with `element()`.
- Attribute values can be strings, numbers or booleans. Attributes whose value
  is `null`, `undefined` or `false` are omitted (unlike `attr()`, which renders
  `false` as `"false"`).
- `key` is rendered as a normal attribute, such as `<entry key="db.url">`. The
  JSX transform passes it separately from the other attributes, so it is always
  rendered first. Write `key` before any spread: `<entry {...props} key="k" />`
  makes TypeScript import `createElement`, which this package does not provide,
  and fails at runtime. `<entry key="k" {...props} />` works.
- Children are the same as `child()`: elements, strings, `cdata()` and so on.
  Numbers are not accepted; convert them to strings.
- A JSX expression is typed as `Child`, not `Element`, because function
  components and fragments (`<>...</>`) can return text, arrays or nothing.
  Pass it to `child()` or `renderTo*()`.
- Babel and Vite (oxc) reject namespaced tags by default. Set
  `throwIfNamespace: false` in their JSX options (`oxc.jsx` in Vite). TypeScript
  and esbuild need no extra configuration.

#### Using with Hono's JSX

If your project uses Hono's JSX (`"jsxImportSource": "hono/jsx"`), keep it in
`tsconfig.json` and add the `@jsxImportSource @shun-shobon/littlexml` pragma to
the files that build XML. Elements from the two runtimes cannot be mixed in one
file, and littlexml elements are not Hono JSX nodes, so return them as a
response body instead of passing them to `c.html()`:

```tsx
/** @jsxImportSource @shun-shobon/littlexml */
import { renderToByteStream } from "@shun-shobon/littlexml";

app.get("/sitemap.xml", (c) =>
	c.body(renderToByteStream(<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" />), {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	}),
);
```

### Streaming response on Cloudflare Workers

`renderToByteStream()` returns a `ReadableStream<Uint8Array>` encoded in UTF-8,
which can be passed to `Response` directly.

```typescript
import { element, renderToByteStream } from "@shun-shobon/littlexml";

export default {
	fetch() {
		const root = element("urlset").attr("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

		return new Response(renderToByteStream(root), {
			headers: { "Content-Type": "application/xml; charset=utf-8" },
		});
	},
};
```
