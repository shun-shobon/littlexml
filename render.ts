import { type XmlVersion } from "./xml.ts";
import { type Element } from "./element.ts";
import { type IndentType } from "./util.ts";

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
  yield* root.toStringIterator(indent, 0);
}

function createXmlDeclaration(version: XmlVersion, encoding: string): string {
  return `<?xml version="${version}" encoding="${encoding}"?>`;
}
