import { describe, expect, test } from "vitest";

import { element, renderToStream, renderToString } from ".";

describe("renderToString", () => {
	test("basic", () => {
		const root = element("root").text("Hello World!");

		const actual = renderToString(root);

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`,
		);
	});

	test("attributes", () => {
		const root = element("root").attr("foo", "bar").text("Hello World!");

		const actual = renderToString(root);

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><root foo="bar">Hello World!</root>`,
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

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><root><child/></root>`,
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

		expect(actual).toBe(
			`<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`,
		);
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
	// eslint-disable-next-line typescript/no-unnecessary-condition, no-constant-condition
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result += value;
	}
	return result;
}
