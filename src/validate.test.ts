import { describe, expect, test } from "vitest";

import { validateChars, validateName } from "./validate";

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

describe("validateChars", () => {
	test.each(["", "Hello", "\t\n\r", "<&>\"'", "\uD7FF\uFFFD", "\u{1F600}", "\u{10FFFF}"])(
		"valid: %j",
		(str) => {
			expect(() => validateChars(str)).not.toThrow();
		},
	);

	test.each([
		"\u0000",
		"a\u0008b",
		"\u001F",
		"\uFFFE",
		"\uFFFF",
		"\uD800",
		"a\uDC00",
		"\uDC00\uD800",
	])("invalid: %j", (str) => {
		expect(() => validateChars(str)).toThrow(TypeError);
	});
});
