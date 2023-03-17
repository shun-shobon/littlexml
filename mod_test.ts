import { assertEquals } from "./dev_deps.ts";
import { element, renderToString } from "./mod.ts";

Deno.test("renderToString", async (t) => {
  await t.step("basic", () => {
    const root = element("root").text("Hello World!");
    const xml = renderToString(root);

    assertEquals(
      xml,
      `<?xml version="1.0" encoding="UTF-8"?><root>Hello World!</root>`,
    );
  });

  await t.step("attributes", () => {
    const root = element("root").attr("foo", "bar").text("Hello World!");
    const xml = renderToString(root, { version: "1.0" });

    assertEquals(
      xml,
      `<?xml version="1.0" encoding="UTF-8"?><root foo="bar">Hello World!</root>`,
    );
  });

  await t.step("children", () => {
    const root = element("root")
      .child(element("child").text("Hello World!"))
      .child(element("child").text("Goodbye World!"));
    const xml = renderToString(root, { version: "1.1" });

    assertEquals(
      xml,
      `<?xml version="1.1" encoding="UTF-8"?><root><child>Hello World!</child><child>Goodbye World!</child></root>`,
    );
  });

  await t.step("no children", () => {
    const root = element("root").child(element("child"));
    const xml = renderToString(root);

    assertEquals(
      xml,
      `<?xml version="1.0" encoding="UTF-8"?><root><child /></root>`,
    );
  });

  await t.step("indent", () => {
    const root = element("root")
      .child(element("child").text("Hello World!"))
      .child(element("child").text("Goodbye World!"));
    const xml = renderToString(root, { indent: 2 });

    assertEquals(
      xml,
      `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <child>Hello World!</child>
  <child>Goodbye World!</child>
</root>`,
    );
  });
});
