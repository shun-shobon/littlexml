import { validateChars, validateName } from "./validate";

/**
 * Pre-rendered markup such as CDATA sections, comments and processing
 * instructions. Create it with `cdata()`, `comment()` or `instruction()`.
 */
export class Markup {
	constructor(
		readonly xml: string,
		readonly isText: boolean,
	) {}
}

/**
 * Create a CDATA section. `]]>` in the text is split into multiple sections.
 */
export function cdata(text: string): Markup {
	validateChars(text);
	return new Markup(`<![CDATA[${text.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`, true);
}

/**
 * Create a comment. Throws `TypeError` if the text contains `--` or ends with
 * `-`.
 */
export function comment(text: string): Markup {
	validateChars(text);
	if (/--|-$/u.test(text)) {
		throw new TypeError(`Invalid comment: ${text}`);
	}
	return new Markup(`<!--${text}-->`, false);
}

/**
 * Create a processing instruction like `<?xml-stylesheet href="style.xsl"?>`.
 * Throws `TypeError` if the target is not an XML name or is `xml`
 * (case-insensitive), or if `?>` appears.
 */
export function instruction(target: string, data = ""): Markup {
	validateName(target);
	validateChars(data);
	const content = data === "" ? target : `${target} ${data}`;
	if (/^xml$/iu.test(target) || content.includes("?>")) {
		throw new TypeError(`Invalid processing instruction: ${content}`);
	}
	return new Markup(`<?${content}?>`, false);
}
