import { type XmlVersion } from "./xml.ts";
import { type Element } from "./element.ts";

type RenderOption = {
  version: XmlVersion;
};

export function renderToString(root: Element, options?: RenderOption): string {
  const version = options?.version ?? "1.0";

  const xmlDeclaration = createXmlDeclaration(version);

  return `${xmlDeclaration}${root.stringify()}`;
}

function createXmlDeclaration(version: XmlVersion): string {
  return `<?xml version="${version}" encoding="UTF-8"?>`;
}
