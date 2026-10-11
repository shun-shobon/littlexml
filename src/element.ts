import { escapeStr } from "./escape";
import { Markup } from "./markup";
import type { IndentType } from "./util";
import { createIndent } from "./util";
import { validateChars, validateName } from "./validate";

export function element(name: string): Element {
	return new Element(name);
}

/**
 * @deprecated Element content is now an ordered list of nodes. This type is
 * no longer used.
 */
export type Content = string | Element[];

/**
 * A node in an element's content. A string is a text node and is escaped on
 * rendering.
 */
export type XmlNode = Element | Markup | string;

/**
 * Value accepted by `child()`. `null`, `undefined` and `false` are ignored,
 * and arrays are flattened.
 */
export type Child = XmlNode | null | undefined | false | readonly Child[];

export class Element {
	readonly #name: string;
	readonly #attributes = new Map<string, string>();
	readonly #children: XmlNode[] = [];

	constructor(name: string) {
		validateName(name);
		this.#name = name;
	}

	attr(name: string, value: string | number | boolean): this {
		validateName(name);
		const str = String(value);
		validateChars(str);
		this.#attributes.set(name, str);
		return this;
	}

	child(...children: Child[]): this {
		pushNodes(this.#children, children);
		return this;
	}

	text(text: string): this {
		this.child(text);
		return this;
	}

	*toStringIterator(indentType: IndentType, level: number): IterableIterator<string> {
		const indent = createIndent(indentType, level);

		const attributes = Array.from(this.#attributes.entries())
			.map(([name, value]) => ` ${name}="${escapeStr(value)}"`)
			.join("");

		if (this.#children.length === 0) {
			yield `${indent}<${this.#name}${attributes}/>`;
			return;
		}

		yield `${indent}<${this.#name}${attributes}>`;
		const isMixed = yield* renderNodes(this.#children, indentType, level + 1);
		yield `${isMixed ? "" : indent}</${this.#name}>`;
	}
}

export function pushNodes(nodes: XmlNode[], children: readonly Child[]): void {
	for (const child of children) {
		if (typeof child === "string") {
			validateChars(child);
			nodes.push(child);
		} else if (child instanceof Element || child instanceof Markup) {
			nodes.push(child);
		} else if (child != null && child !== false) {
			pushNodes(nodes, child);
		}
	}
}

/**
 * Renders nodes and returns whether they contain text.
 */
export function* renderNodes(
	nodes: readonly XmlNode[],
	indentType: IndentType,
	level: number,
): Generator<string, boolean> {
	// Indenting would add whitespace to text, which changes the content.
	const isMixed = nodes.some(
		(node) => typeof node === "string" || (node instanceof Markup && node.isText),
	);
	const childIndentType = isMixed ? "none" : indentType;
	for (const node of nodes) {
		if (typeof node === "string") {
			yield escapeStr(node);
		} else if (node instanceof Markup) {
			yield createIndent(childIndentType, level) + node.xml;
		} else {
			yield* node.toStringIterator(childIndentType, level);
		}
	}
	return isMixed;
}
