import { describe, expect, test } from "vitest";

import { element, renderToStream, renderToString } from ".";

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
