import { escapeStr } from "./escape.ts";
import { createIndent, type IndentType } from "./util.ts";

export function element(name: string) {
  return new Element(name);
}

export type Content = string | Element[];

export class Element {
  #name: string;
  #attributes: Map<string, string> = new Map();
  #children?: Content;

  constructor(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  get attributes(): Map<string, string> {
    return this.attributes;
  }

  get children(): Content | undefined {
    return this.#children;
  }

  attr(name: string, value: string): this {
    this.#attributes.set(name, value);
    return this;
  }

  child(child: Element): this {
    if (typeof this.#children === "string") {
      throw new Error("Cannot add child to element with text content");
    }
    if (this.#children === undefined) {
      this.#children = [];
    }
    this.#children.push(child);

    return this;
  }

  text(text: string): this {
    if (this.#children !== undefined) {
      throw new Error("Cannot add text to element with children");
    }
    this.#children = text;

    return this;
  }

  stringify(indentType: IndentType, level?: number): string {
    const indent = createIndent(indentType, level ?? 0);

    const attributes = Array.from(this.#attributes.entries())
      .map(([key, value]) => ` ${key}="${escapeStr(value)}"`)
      .join("");

    if (this.#children === undefined) {
      return `${indent}<${this.#name}${attributes} />`;
    }

    if (typeof this.#children === "string") {
      return `${indent}<${this.#name}${attributes}>${
        escapeStr(this.#children)
      }</${this.#name}>`;
    }

    const children = this.#children.map((child) =>
      child.stringify(indentType, level === undefined ? undefined : level + 1)
    ).join("");

    return `${indent}<${this.#name}${attributes}>${children}${indent}</${this.#name}>`;
  }
}
