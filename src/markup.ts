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
	return new Markup(`<![CDATA[${text.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`, true);
}

/**
 * Create a comment. Throws `TypeError` if the text contains `--` or ends with
 * `-`.
 */
export function comment(text: string): Markup {
	if (/--|-$/u.test(text)) {
		throw new TypeError(`Comment must not contain "--" or end with "-"`);
	}
	return new Markup(`<!--${text}-->`, false);
}

/**
 * Create a processing instruction like `<?xml-stylesheet href="style.xsl"?>`.
 * Throws `TypeError` if the target is `xml` (case-insensitive) or `?>` appears.
 */
export function instruction(target: string, data = ""): Markup {
	const content = data === "" ? target : `${target} ${data}`;
	if (/^xml$/iu.test(target) || content.includes("?>")) {
		throw new TypeError(`Processing instruction must not target "xml" or contain "?>"`);
	}
	return new Markup(`<?${content}?>`, false);
}
