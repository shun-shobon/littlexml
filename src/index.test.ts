import { describe, expect, test } from "vitest";

import { Element, element, renderToByteStream, renderToStream, renderToString } from ".";

describe("renderToString", () => {
	test("basic", () => {
		const root = element("root").text("Hello World!");

		const actual = renderToString(root);

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`);
	});

	test("attributes", () => {
		const root = element("root").attr("foo", "bar").text("Hello World!");

		const actual = renderToString(root);

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><root foo="bar">Hello World!</root>`,
		);
	});

	test("non-string attributes", () => {
		const root = element("svg").attr("width", 100).attr("height", 0.5).attr("hidden", false);

		const actual = renderToString(root);

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><svg width="100" height="0.5" hidden="false"/>`,
		);
	});

	test("children", () => {
		const root = element("root")
			.child(element("child").text("Hello World!"))
			.child(element("child").text("Goodbye World!"));

		const actual = renderToString(root, { version: "1.1" });

		expect(actual).toBe(
			`<?xml version="1.1" encoding="UTF-8"?><root><child>Hello World!</child><child>Goodbye World!</child></root>`,
		);
	});

	test("no children", () => {
		const root = element("root").child(element("child"));

		const actual = renderToString(root);

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><root><child/></root>`);
	});

	test("conditional and nested children", () => {
		const items = ["a", "b"];
		const root = element("root").child(
			false,
			null,
			undefined,
			items.map((item) => element("item").text(item)),
			[[element("deep")], [false]],
		);

		const actual = renderToString(root, { indent: 2 });

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>a</item>
  <item>b</item>
  <deep/>
</root>`,
		);
	});

	test("mixed content", () => {
		const root = element("p").text("foo ").child(element("b").text("bar"), " & ").text("baz");

		const actual = renderToString(root);

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><p>foo <b>bar</b> &amp; baz</p>`);
	});

	test("mixed content with indent", () => {
		const root = element("body").child(
			element("p").child(element("b").text("1")),
			element("p").child("foo ", element("span").child(element("b").text("bar")), " baz"),
		);

		const actual = renderToString(root, { indent: 2 });

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>
<body>
  <p>
    <b>1</b>
  </p>
  <p>foo <span><b>bar</b></span> baz</p>
</body>`,
		);
	});

	test("empty text", () => {
		const root = element("root").child(element("a").text(""), element("b").child());

		const actual = renderToString(root);

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><root><a></a><b/></root>`);
	});

	test("indent", () => {
		const root = element("root")
			.child(element("child").text("Hello World!"))
			.child(element("child").text("Goodbye World!"));

		const actual = renderToString(root, { indent: 2 });

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <child>Hello World!</child>
  <child>Goodbye World!</child>
</root>`,
		);
	});
});

describe("validation", () => {
	test("invalid element name", () => {
		expect(() => element("1root")).toThrow(TypeError);
		expect(() => new Element("a b")).toThrow(TypeError);
	});

	test("invalid attribute name", () => {
		expect(() => element("a").attr('x="1" onload', "v")).toThrow(TypeError);
	});

	test("invalid character in attribute value", () => {
		expect(() => element("a").attr("x", "\u0000")).toThrow(TypeError);
	});

	test("invalid character in text", () => {
		expect(() => element("a").text("\uFFFF")).toThrow(TypeError);
	});

	test("invalid character in text node passed to child()", () => {
		expect(() => element("a").child("\u0000")).toThrow(TypeError);
		expect(() => element("a").child(["ok", ["\uDC00"]])).toThrow(TypeError);
	});

	test("number and boolean attribute values are accepted", () => {
		const root = element("a").attr("n", 1).attr("b", false);

		expect(renderToString(root)).toBe(`<?xml version="1.0" encoding="UTF-8"?><a n="1" b="false"/>`);
	});

	test("namespaced names", () => {
		const root = element("x:root").attr("xmlns:x", "urn:x").text("ok");

		expect(renderToString(root)).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><x:root xmlns:x="urn:x">ok</x:root>`,
		);
	});

	test("without declaration", () => {
		const root = element("svg").child(element("circle").attr("r", 10));

		expect(renderToString(root, { declaration: false })).toBe(`<svg><circle r="10"/></svg>`);
		expect(renderToString(root, { declaration: false, indent: 2 })).toBe(
			`<svg>\n  <circle r="10"/>\n</svg>`,
		);
	});

	test("fragment without declaration", () => {
		const fragment = [" foo ", element("b").text("bar")];

		expect(renderToString(fragment, { declaration: false, indent: 2 })).toBe(` foo <b>bar</b>`);
	});
});

describe("renderToStream", () => {
	test("basic", async () => {
		const root = element("root").text("Hello World!");
		const stream = renderToStream(root);

		const actual = await streamToString(stream);

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`);
	});

	test("indent", async () => {
		const root = element("root")
			.child(element("child").text("Hello World!"))
			.child(element("child").text("Goodbye World!"));
		const stream = renderToStream(root, { indent: 2 });

		const actual = await streamToString(stream);

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>
<root>
  <child>Hello World!</child>
  <child>Goodbye World!</child>
</root>`,
		);
	});
});

describe("renderToByteStream", () => {
	test("basic", async () => {
		const root = element("root").text("こんにちは");

		const actual = await new Response(renderToByteStream(root)).text();

		expect(actual).toBe(`<?xml version="1.0" encoding="UTF-8"?><root>こんにちは</root>`);
	});
});

async function streamToString(stream: ReadableStream<string>): Promise<string> {
	const reader = stream.getReader();
	let result = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result += value;
	}
	return result;
}
