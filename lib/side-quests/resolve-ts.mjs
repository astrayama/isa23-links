// Test-only: lets `node --test` resolve imports the way Next.js does — relative
// imports without an extension (`./parse` → `./parse.ts`) and package subpaths
// without one (`next/constants` → `next/constants.js`). Node strips the types itself.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (err?.code !== "ERR_MODULE_NOT_FOUND") throw err;
      return nextResolve(`${specifier}${specifier.startsWith(".") ? ".ts" : ".js"}`, context);
    }
  },
});
