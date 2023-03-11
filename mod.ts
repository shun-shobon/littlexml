type Element = {
  name: string;
  attributes: Record<string, string>;
  children: Element[] | string;
};

export function element(
  name: string,
  attributes: Record<string, string>,
  children: Element[] | string
): Element {
  return { name, attributes, children };
}

export function render(version: string, element: Element): string {
  return `<?xml version="${version}" encoding="UTF-8"?>${renderElement(
    element
  )}`;
}

export function renderElement(element: Element): string {
  const attributes = Object.entries(element.attributes)
    .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
    .join("");

  if (element.children.length === 0) {
    return `<${element.name} ${attributes} />`;
  }

  const children =
    typeof element.children === "string"
      ? escapeHtml(element.children)
      : element.children.map(renderElement).join("");

  return `<${element.name}${attributes}>${children}</${element.name}>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
