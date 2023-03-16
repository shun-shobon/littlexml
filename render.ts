import { type XmlVersion } from "./xml.ts";
import { type Element } from "./element.ts";
import { type IndentType } from "./util.ts";

export type RenderOption = {
  version?: XmlVersion;
  indent?: IndentType;
};

export function renderToString(root: Element, options?: RenderOption): string {
  const version = options?.version ?? "1.0";

  const xmlDeclaration = createXmlDeclaration(version);

  return xmlDeclaration +
    root.stringify(options?.indent ?? "none", 0);
}

function createXmlDeclaration(version: XmlVersion): string {
  return `<?xml version="${version}" encoding="UTF-8"?>`;
}
