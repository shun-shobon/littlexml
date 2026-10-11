const nameStartChar =
	":A-Z_a-z\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\u{10000}-\\u{EFFFF}";
const nameRe = new RegExp(
	`^[${nameStartChar}][${nameStartChar}\\-.0-9\\xB7\\u0300-\\u036F\\u203F\\u2040]*$`,
	"u",
);
// Lone surrogates are matched too because of the `u` flag.
const invalidCharRe = /[^\t\n\r\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/u;

export function validateName(name: string): void {
	if (!nameRe.test(name)) {
		throw new TypeError(`Invalid XML name: ${JSON.stringify(name)}`);
	}
}

export function validateChars(str: string): void {
	if (invalidCharRe.test(str)) {
		throw new TypeError("Invalid XML character");
	}
}
