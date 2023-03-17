import { Element, element } from "./element.ts";
import { _stringifyElement, elementToStrings } from "./render.ts";

function createRoot(): Element {
  const root = element("root");
  for (let i = 0; i < 10 ** 5; i++) {
    root.attr(`foo${i}`, `bar${i}`);
  }
  for (let i = 0; i < 10 ** 5; i++) {
    root.child(element("child").text("Hello World!"));
  }

  return root;
}

Deno.bench("rendering element (_stringifyElement)", () => {
  _stringifyElement(createRoot(), "none", 0);
});

Deno.bench("rendering element (elementToStrings)", () => {
  elementToStrings(createRoot(), "none", 0);
});

Deno.bench("rendering element (elementToStrings and .join)", () => {
  Array.from(elementToStrings(createRoot(), "none", 0)).join("");
});

Deno.bench("rendering element (elementToStrings and +)", () => {
  let str = "";
  for (const s of elementToStrings(createRoot(), "none", 0)) {
    str += s;
  }
});

Deno.bench("rendering element (elementToStrings and .concat)", () => {
  let str = "";
  for (const s of elementToStrings(createRoot(), "none", 0)) {
    str = str.concat(s);
  }
});

Deno.bench(
  "rendering element (elementToStrings and template literal strings)",
  () => {
    let str = "";
    for (const s of elementToStrings(createRoot(), "none", 0)) {
      str = `${str}${s}`;
    }
  },
);
