import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { render, element } from "./mod.ts";

Deno.test("render", () => {
  const xml = render("1.0", element("root", {}, "Hello World!"));

  assertEquals(
    xml,
    `<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`
  );
});
