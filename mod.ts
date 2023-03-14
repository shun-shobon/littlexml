type XmlVersion = "1.0" | "1.1";

type Element = {
  name: string;
  attributes: Record<string, string>;
  children: Child[];
};

type Child = Element | string;

export function h(
  name: string,
  attributes: Record<string, string>,
  children: Child | Child[]
): Element {
  return {
    name,
    attributes,
    children: Array.isArray(children) ? children : [children],
  };
}

export function render(version: XmlVersion, element: Element): string {
  return `${createXmlDeclaration(version)}${renderElement(element)}`;
}

export function renderElement(element: Element): string {
  const attributes = Object.entries(element.attributes)
    .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
    .join("");

  if (element.children.length === 0) {
    return `<${element.name}${attributes} />`;
  }

  const children = element.children
    .map((child) =>
      typeof child === "string" ? escapeHtml(child) : renderElement(child)
    )
    .join("");

  return `<${element.name}${attributes}>${children}</${element.name}>`;
}

function createXmlDeclaration(version: XmlVersion): string {
  return `<?xml version="${version}" encoding="UTF-8"?>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
