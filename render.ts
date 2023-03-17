import { type XmlVersion } from "./xml.ts";
import { type Element } from "./element.ts";
import { createIndent, type IndentType } from "./util.ts";
import { escapeStr } from "./escape.ts";

/**
 * Options for rendering.
 */
export type RenderOption = {
  /**
   * XML version. Note as if you specify `1.1`, the output won't be changed.
   *
   * @default "1.0"
   */
  version?: XmlVersion;
  /**
   * Encoding. Note if you specify `Shift_JIS`, the output won't be Shift_JIS encoded.
   * You need to convert the output to Shift_JIS by yourself.
   *
   * @default "UTF-8"
   */
  encoding?: string;
  /**
   * Indent type.
   * If you specify `none`, the output won't be indented and will be in one line.
   * If you specify `tab`, the output will be indented with tab characters.
   * If you specify number, the output will be indented with that number of spaces.
   *
   * @default "none"
   */
  indent?: IndentType;
};

/**
 * Render an XML element to a string.
 */
export function renderToString(root: Element, options?: RenderOption): string {
  const iterator = renderToIterator(root, options);

  return Array.from(iterator).join("");
}

/**
 * Render an XML element to a stream of strings.
 */
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

/**
 * Render an XML element to an iterator of strings.
 */
export function* renderToIterator(
  root: Element,
  options?: RenderOption,
): IterableIterator<string> {
  const version = options?.version ?? "1.0";
  const encoding = options?.encoding ?? "UTF-8";
  const indent = options?.indent ?? "none";

  const xmlDeclaration = createXmlDeclaration(version, encoding);

  yield xmlDeclaration;

  yield* elementToStrings(root, indent, 0);
}

function createXmlDeclaration(version: XmlVersion, encoding: string): string {
  return `<?xml version="${version}" encoding="${encoding}"?>`;
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
