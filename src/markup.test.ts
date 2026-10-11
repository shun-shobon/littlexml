import { describe, expect, test } from "vitest";

import { cdata, comment, element, instruction, renderToString } from ".";

const declaration = `<?xml version="1.0" encoding="UTF-8"?>`;

describe("cdata", () => {
	test("basic", () => {
		const root = element("description").child(cdata("<p>Hello & World</p>"));

		expect(renderToString(root)).toBe(
			`${declaration}<description><![CDATA[<p>Hello & World</p>]]></description>`,
		);
	});

	test("split terminator", () => {
		expect(cdata("a]]>b]]>").xml).toBe("<![CDATA[a]]]]><![CDATA[>b]]]]><![CDATA[>]]>");
	});

	test("invalid character", () => {
		expect(() => cdata("\uFFFE")).toThrow(TypeError);
	});

	test("is treated as text when indenting", () => {
		const root = element("item").child(
			element("title").text("Title"),
			element("description").child(cdata("<p>body</p>")),
		);

		expect(renderToString(root, { indent: 2 })).toBe(
			`${declaration}
<item>
  <title>Title</title>
  <description><![CDATA[<p>body</p>]]></description>
</item>`,
		);
	});
});

describe("comment", () => {
	test("basic", () => {
		const root = element("root").child(comment(" note - here "), element("child"));

		expect(renderToString(root, { indent: 2 })).toBe(
			`${declaration}
<root>
  <!-- note - here -->
  <child/>
</root>`,
		);
	});

	test("in mixed content", () => {
		const root = element("p").text("foo").child(comment("x")).text("bar");

		expect(renderToString(root, { indent: 2 })).toBe(`${declaration}\n<p>foo<!--x-->bar</p>`);
	});

	test("invalid", () => {
		expect(() => comment("a--b")).toThrow(TypeError);
		expect(() => comment("a-")).toThrow(TypeError);
		expect(() => comment("\u0000")).toThrow(TypeError);
	});
});

describe("instruction", () => {
	test("before root element", () => {
		const root = element("rss").attr("version", "2.0");

		expect(
			renderToString([instruction("xml-stylesheet", 'type="text/xsl" href="/rss.xsl"'), root], {
				indent: 2,
			}),
		).toBe(
			`${declaration}
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0"/>`,
		);
	});

	test("without data", () => {
		expect(instruction("target").xml).toBe("<?target?>");
	});

	test("invalid", () => {
		expect(() => instruction("xml", 'version="1.0"')).toThrow(TypeError);
		expect(() => instruction("XML")).toThrow(TypeError);
		expect(() => instruction("target", "a?>b")).toThrow(TypeError);
		expect(() => instruction("a?>")).toThrow(TypeError);
		expect(() => instruction("x><y")).toThrow(TypeError);
		expect(() => instruction("")).toThrow(TypeError);
		expect(() => instruction("target", "\uD800")).toThrow(TypeError);
	});
});
