import { escapeStr } from "./escape";
import type { IndentType } from "./util";
import { createIndent } from "./util";

export function element(name: string): Element {
	return new Element(name);
}

export type Content = string | Element[];

export class Element {
	readonly #name: string;
	readonly #attributes = new Map<string, string>();
	#children?: Content;

	constructor(name: string) {
		this.#name = name;
	}

	attr(name: string, value: string): this {
		this.#attributes.set(name, value);
		return this;
	}

	child(...children: Element[]): this {
		if (typeof this.#children === "string") {
			throw new TypeError("Cannot add child to element with text content");
		}
		if (this.#children === undefined) {
			this.#children = [];
		}
		this.#children.push(...children);

		return this;
	}

	text(text: string): this {
		if (this.#children !== undefined) {
			throw new TypeError("Cannot add text to element with children");
		}
		this.#children = text;

		return this;
	}

	*toStringIterator(
		indentType: IndentType,
		level: number,
	): IterableIterator<string> {
		const indent = createIndent(indentType, level);

		const attributes = Array.from(this.#attributes.entries())
			.map(([name, value]) => ` ${name}="${escapeStr(value)}"`)
			.join("");

		if (this.#children === undefined) {
			yield `${indent}<${this.#name}${attributes}/>`;
			return;
		}

		yield `${indent}<${this.#name}${attributes}>`;

		if (typeof this.#children === "string") {
			yield `${escapeStr(this.#children)}</${this.#name}>`;
			return;
		}

		for (const child of this.#children) {
			yield* child.toStringIterator(indentType, level + 1);
		}
		yield `${indent}</${this.#name}>`;
	}
}
