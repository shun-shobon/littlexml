import { describe, expect, test } from "vitest";

import type { Child } from ".";
import { cdata, comment, element, renderToString } from ".";
import { jsxDEV } from "./jsx-dev-runtime";
import { Fragment, jsx } from "./jsx-runtime";

function render(root: Child): string {
	return renderToString(root, { declaration: false });
}

describe("jsx", () => {
	test("attributes", () => {
		const root = <svg width={100} height={0.5} visible={true} id="a&b" />;

		expect(render(root)).toBe(`<svg width="100" height="0.5" visible="true" id="a&amp;b"/>`);
	});

	test("null, undefined and false attributes are omitted", () => {
		const root = <root a={null} b={undefined} c={false} d={0} e="" />;

		expect(render(root)).toBe(`<root d="0" e=""/>`);
	});

	test("children", () => {
		const root = (
			<root>
				<child>Hello</child>
				text
				<child />
			</root>
		);

		expect(render(root)).toBe(`<root><child>Hello</child>text<child/></root>`);
	});

	test("function component", () => {
		const Url = ({ loc }: { loc: string }) => (
			<url>
				<loc>{loc}</loc>
			</url>
		);
		const Wrapper = ({ children }: { children?: Child }) => <wrapper>{children}</wrapper>;

		const root = (
			<urlset>
				{["a", "b"].map((loc) => (
					<Url loc={loc} />
				))}
				<Wrapper>
					<x />
				</Wrapper>
			</urlset>
		);

		expect(render(root)).toBe(
			`<urlset><url><loc>a</loc></url><url><loc>b</loc></url><wrapper><x/></wrapper></urlset>`,
		);
	});

	test("component returning text or nothing", () => {
		const Text = () => "text";
		const Nothing = () => null;

		expect(
			render(
				<root>
					<Text />
					<Nothing />
				</root>,
			),
		).toBe(`<root>text</root>`);
	});

	test("fragment", () => {
		const root = (
			<>
				{comment(" generated ")}
				<root />
			</>
		);

		expect(renderToString(root, { indent: 2 })).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>\n<!-- generated -->\n<root/>`,
		);
		expect(render(<root>{<>{[<a />, <b />]}</>}</root>)).toBe(`<root><a/><b/></root>`);
		expect(Fragment({})).toStrictEqual([undefined]);
	});

	test("conditional children", () => {
		const show = (value: boolean) => (
			<root>
				{value && <shown />}
				{value ? null : undefined}
			</root>
		);

		expect(render(show(true))).toBe(`<root><shown/></root>`);
		expect(render(show(false))).toBe(`<root/>`);
	});

	test("namespaced names", () => {
		const root = (
			<urlset
				xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
				xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
			>
				<url>
					<image:image>
						<image:loc>https://example.com/image.png</image:loc>
					</image:image>
				</url>
			</urlset>
		);

		expect(renderToString(root, { indent: 2 })).toBe(
			`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <image:image>
      <image:loc>https://example.com/image.png</image:loc>
    </image:image>
  </url>
</urlset>`,
		);
	});

	test("cdata", () => {
		const root = (
			<item>
				<description>{cdata("<p>Hi!</p>")}</description>
				<content>before{cdata("]]>")}after</content>
			</item>
		);

		expect(render(root)).toBe(
			`<item><description><![CDATA[<p>Hi!</p>]]></description><content>before<![CDATA[]]]]><![CDATA[>]]>after</content></item>`,
		);
	});

	test("validation errors propagate", () => {
		expect(() => jsx("1root", {})).toThrow(TypeError);
		expect(() => <root {...{ "a b": "x" }} />).toThrow(TypeError);
		expect(() => <root a={"\0"} />).toThrow(TypeError);
		expect(() => <root>{"\0"}</root>).toThrow(TypeError);
	});

	test("object attribute values throw", () => {
		expect(() => <root a={element("x")} />).toThrow(TypeError);
		expect(() => <root a={cdata("x")} />).toThrow(TypeError);
		expect(() => <root a={["x"]} />).toThrow(TypeError);
		// @ts-expect-error -- an untyped key can still be an object.
		expect(() => jsx("root", {}, element("x"))).toThrow(TypeError);
	});

	test("key is rendered before the other attributes", () => {
		const props = { a: "1" };

		expect(render(<entry b="2" key="db.url" c={3} />)).toBe(`<entry key="db.url" b="2" c="3"/>`);
		expect(render(<entry key={1} {...props} />)).toBe(`<entry key="1" a="1"/>`);
		expect(render(<entry key={null} />)).toBe(`<entry/>`);
		expect(render(jsx("entry", { b: "2" }, "k"))).toBe(`<entry key="k" b="2"/>`);
		expect(() => jsx("entry", {}, "\0")).toThrow(TypeError);
	});

	test("key is ignored for function components", () => {
		const Entry = ({ value }: { value: string }) => <entry>{value}</entry>;

		expect(render(jsx(Entry, { value: "v" }, "k"))).toBe(`<entry>v</entry>`);
	});

	test("jsxDEV", () => {
		expect(render(jsxDEV("root", { a: 1, children: "x" }))).toBe(`<root a="1">x</root>`);
		expect(render(jsxDEV("entry", { b: "2" }, "k"))).toBe(`<entry key="k" b="2"/>`);
	});
});

// Type-level tests checked by `tsc --noEmit`.
export function typeTests(): Child[] {
	const Url = ({ loc }: { loc: string }) => <url>{loc}</url>;
	return [
		<image:loc xmlns:image="i" />,
		<a n={1} b={false} u={undefined} />,
		// @ts-expect-error -- `loc` must be a string.
		<Url loc={1} />,
		// @ts-expect-error -- `loc` is required.
		<Url />,
		// @ts-expect-error -- `Url` takes no children.
		<Url loc="a">child</Url>,
		// @ts-expect-error -- attribute values must be primitives.
		<a b={{}} />,
		// @ts-expect-error -- children must be `Child`.
		<a>{1}</a>,
	];
}
