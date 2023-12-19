import { describe, expect, test } from "vitest";

import { createIndent } from "./util";

describe("createIndent", () => {
	test("none", () => {
		expect(createIndent("none", 0)).toBe("");
		expect(createIndent("none", 4)).toBe("");
	});

	test("tab", () => {
		expect(createIndent("tab", 0)).toBe("\n");
		expect(createIndent("tab", 2)).toBe("\n\t\t");
		expect(createIndent("tab", 3)).toBe("\n\t\t\t");
	});

	test("space", () => {
		expect(createIndent(2, 0)).toBe("\n");
		expect(createIndent(2, 1)).toBe("\n  ");
		expect(createIndent(4, 2)).toBe("\n        ");
	});
});
