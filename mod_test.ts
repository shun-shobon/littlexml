import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { element, renderToString } from "./mod.ts";

Deno.test("render (basic)", () => {
  const root = element("root").text("Hello World!");
  const xml = renderToString(root, { version: "1.0" });

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`,
  );
});

Deno.test("render (attributes)", () => {
  const root = element("root").attr("foo", "bar").text("Hello World!");
  const xml = renderToString(root, { version: "1.0" });

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root foo="bar">Hello World!</root>`,
  );
});

Deno.test("render (children)", () => {
  const root = element("root")
    .child(element("child").text("Hello World!"))
    .child(element("child").text("Goodbye World!"));
  const xml = renderToString(root, { version: "1.0" });

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root><child>Hello World!</child><child>Goodbye World!</child></root>`,
  );
});
