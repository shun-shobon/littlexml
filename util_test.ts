import { assertEquals } from "./dev_deps.ts";
import { createIndent } from "./util.ts";

Deno.test("createIndent", async (t) => {
  await t.step("none", () => {
    assertEquals(createIndent("none", 0), "");
    assertEquals(createIndent("none", 4), "");
  });

  await t.step("tab", () => {
    assertEquals(createIndent("tab", 0), "\n");
    assertEquals(createIndent("tab", 2), "\n\t\t");
    assertEquals(createIndent("tab", 3), "\n\t\t\t");
  });

  await t.step("spcae", () => {
    assertEquals(createIndent(2, 0), "\n");
    assertEquals(createIndent(2, 1), "\n  ");
    assertEquals(createIndent(4, 2), "\n        ");
  });
});
