// export function add(a: number, b: number): number {
//   return a + b;
// }

// // Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
// if (import.meta.main) {
//   console.log("Add 2 + 3 =", add(2, 3));
// }
import * as log from "@std/log";

// Setup logger
await log.setup({
  handlers: {
    console: new log.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

const logger = log.getLogger();

Deno.serve({ port: 8000 }, (req) => {
  return new Response("Hello World\n");
});

logger.info("Server running at http://localhost:8000/");
