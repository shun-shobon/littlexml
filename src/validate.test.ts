import { describe, expect, test } from "vitest";

import { validateName } from "./validate";

describe("validateName", () => {
	test.each(["a", "_a", ":a", "a:b", "a-b.c_1", "xml", "À", "a·", "要素", "\u{10000}"])(
		"valid: %j",
		(name) => {
			expect(() => validateName(name)).not.toThrow();
		},
	);

	test.each([
		"",
		"1a",
		"-a",
		".a",
		"·a",
		"a b",
		'x="1" onload',
		"a>",
		"a&amp;",
		"a×",
		"a\uFFFE",
		"\uD800",
		"\u{F0000}",
	])("invalid: %j", (name) => {
		expect(() => validateName(name)).toThrow(TypeError);
	});
});
