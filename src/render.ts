import type { Child, XmlNode } from "./element";
import { pushNodes, renderNodes } from "./element";
import type { IndentType } from "./util";
import type { XmlVersion } from "./xml";

/**
 * Options for rendering.
 */
export interface RenderOption {
	/**
	 * XML version. Note as if you specify `1.1`, the output won't be changed.
	 *
	 * @default "1.0"
	 */
	version?: XmlVersion;
	/**
	 * Encoding. Note if you specify `Shift_JIS`, the output won't be Shift_JIS
	 * encoded. You need to convert the output to Shift_JIS by yourself.
	 *
	 * @default "UTF-8"
	 */
	encoding?: string;
	/**
	 * Indent type. If you specify `none`, the output won't be indented and will
	 * be in one line. If you specify `tab`, the output will be indented with tab
	 * characters. If you specify number, the output will be indented with that
	 * number of spaces.
	 *
	 * @default "none"
	 */
	indent?: IndentType;
}

/**
 * Render an XML element to a string. `root` can also be a list of nodes, such
 * as processing instructions and comments followed by the root element.
 */
export function renderToString(root: Child, options?: RenderOption): string {
	const iterator = renderToIterator(root, options);

	return Array.from(iterator).join("");
}

/**
 * Render an XML element to a stream of strings.
 */
export function renderToStream(root: Child, options?: RenderOption): ReadableStream<string> {
	const iterator = renderToIterator(root, options);

	return new ReadableStream({
		pull(controller) {
			// oxlint-disable-next-line typescript/no-unsafe-assignment
			const { done, value } = iterator.next();
			if (done ?? false) {
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
export function* renderToIterator(root: Child, options?: RenderOption): IterableIterator<string> {
	const version = options?.version ?? "1.0";
	const encoding = options?.encoding ?? "UTF-8";
	const indent = options?.indent ?? "none";

	const xmlDeclaration = createXmlDeclaration(version, encoding);

	const nodes: XmlNode[] = [];
	pushNodes(nodes, [root]);

	yield xmlDeclaration;
	yield* renderNodes(nodes, indent, 0);
}

function createXmlDeclaration(version: XmlVersion, encoding: string): string {
	return `<?xml version="${version}" encoding="${encoding}"?>`;
}
