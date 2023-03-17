import { type XmlVersion } from "./xml.ts";
import { type Element } from "./element.ts";
import { createIndent, type IndentType } from "./util.ts";
import { escapeStr } from "./escape.ts";

export type RenderOption = {
  version?: XmlVersion;
  indent?: IndentType;
};

export function renderToString(root: Element, options?: RenderOption): string {
  return Array.from(renderToIterator(root, options)).join("");
}

export function renderToStream(
  root: Element,
  options?: RenderOption,
): ReadableStream<string> {
  const iterator = renderToIterator(root, options);

  return new ReadableStream({
    pull(controller) {
      const { done, value } = iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export function* renderToIterator(
  root: Element,
  options?: RenderOption,
): IterableIterator<string> {
  const version = options?.version ?? "1.0";

  const xmlDeclaration = createXmlDeclaration(version);

  yield xmlDeclaration;

  yield* elementToStrings(root, options?.indent ?? "none", 0);
}

function createXmlDeclaration(version: XmlVersion): string {
  return `<?xml version="${version}" encoding="UTF-8"?>`;
}

export function* elementToStrings(
  element: Element,
  indentType: IndentType,
  level: number,
): IterableIterator<string> {
  const indent = createIndent(indentType, level);

  yield `${indent}<${element.name}`;

  for (const [key, value] of element.attributes.entries()) {
    yield ` ${key}="${escapeStr(value)}"`;
  }

  if (element.children === undefined) {
    yield " />";
    return;
  }

  if (typeof element.children === "string") {
    yield `>${escapeStr(element.children)}</${element.name}>`;
    return;
  }

  yield ">";
  for (const child of element.children) {
    yield* elementToStrings(child, indentType, level + 1);
  }
  yield `${indent}</${element.name}>`;
}

/**
 * @deprecated This is a function that remains only for benchmarking purposes. Use `elementToStrings` instead.
 */
export function _stringifyElement(
  element: Element,
  indentType: IndentType,
  level?: number,
): string {
  const indent = createIndent(indentType, level ?? 0);

  const attributes = Array.from(element.attributes.entries())
    .map(([key, value]) => ` ${key}="${escapeStr(value)}"`)
    .join("");

  if (element.children === undefined) {
    return `${indent}<${element.name}${attributes} />`;
  }

  if (typeof element.children === "string") {
    return `${indent}<${element.name}${attributes}>${
      escapeStr(element.children)
    }</${element.name}>`;
  }

  const children = element.children.map((child) =>
    _stringifyElement(
      child,
      indentType,
      level === undefined ? undefined : level + 1,
    )
  ).join("");

  return `${indent}<${element.name}${attributes}>${children}${indent}</${element.name}>`;
}
