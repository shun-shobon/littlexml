import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { render, h } from "./mod.ts";

Deno.test("render (basic)", () => {
  const xml = render("1.0", h("root", {}, "Hello World!"));

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`
  );
});

Deno.test("render (attributes)", () => {
  const xml = render("1.0", h("root", { foo: "bar" }, "Hello World!"));

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root foo="bar">Hello World!</root>`
  );
});

Deno.test("render (children)", () => {
  const xml = render(
    "1.0",
    h("root", {}, [
      h("child", {}, "Hello World!"),
      h("child", {}, "Hello World!"),
    ])
  );

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root><child>Hello World!</child><child>Hello World!</child></root>`
  );
});
