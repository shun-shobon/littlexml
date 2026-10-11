import type { Child } from "./element";
import { element } from "./element";

/**
 * Attribute value accepted in JSX. `null`, `undefined` and `false` omit the
 * attribute, unlike `attr()` which renders `false` as `"false"`.
 */
export type AttributeValue = string | number | boolean | null | undefined;

/**
 * Props of an intrinsic element.
 */
export interface IntrinsicElementProps {
	children?: Child;
	// `Child` is included because `children` must satisfy the index signature.
	[name: string]: AttributeValue | Child;
}

export type Component<P> = (props: P) => Child;

export declare namespace JSX {
	/**
	 * `Child` rather than `Element` so that components can return text,
	 * arrays or nothing.
	 */
	type Element = Child;
	interface ElementChildrenAttribute {
		children: unknown;
	}
	interface IntrinsicElements {
		[name: string]: IntrinsicElementProps;
	}
}

/**
 * Create an element from a tag name, or call a function component with the
 * props.
 *
 * `key` is rendered as an attribute before the other attributes, because the
 * JSX transform passes it separately from the props. It is ignored for
 * function components.
 *
 * Throws `TypeError` if an attribute value is an object, such as an element,
 * `cdata()` or an array.
 */
export function jsx(
	tag: string | Component<any>,
	props: IntrinsicElementProps,
	key?: AttributeValue,
): Child {
	if (typeof tag === "function") {
		return tag(props);
	}
	const { children, ...attributes } = props;
	const el = element(tag);
	for (const [name, value] of Object.entries({ key, ...attributes })) {
		if (value != null && value !== false) {
			if (typeof value === "object") {
				throw new TypeError(`Invalid attribute value: ${name}`);
			}
			el.attr(name, value);
		}
	}
	return el.child(children);
}

export { jsx as jsxs };

/**
 * Return the children as an array, which `child()` and `renderTo*()` flatten.
 */
export function Fragment({ children }: { children?: Child }): Child {
	return [children];
}
