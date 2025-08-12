import { assertEquals } from "@std/assert";
import * as log from "@std/log";

// Mock the logger to prevent console output during tests
await log.setup({
  handlers: {
    console: new log.ConsoleHandler("CRITICAL"),
  },
  loggers: {
    default: {
      level: "CRITICAL",
      handlers: ["console"],
    },
  },
});

Deno.test("Server responds with Hello World", async () => {
  // Start server on a different port for testing
  const controller = new AbortController();
  const server = Deno.serve(
    { port: 8000, hostname: "127.0.0.1", signal: controller.signal },
    (req) => {
      return new Response("Hello World\n");
    },
  );

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // Make request to server
    const response = await fetch("http://127.0.0.1:8000");
    const text = await response.text();

    // Assert response
    assertEquals(response.status, 200);
    assertEquals(text, "Hello World\n");
  } finally {
    // Clean up: stop the server
    controller.abort();
    await server.finished;
  }
});

Deno.test("Server handles multiple requests", async () => {
  const controller = new AbortController();
  const server = Deno.serve(
    { port: 8000, hostname: "127.0.0.1", signal: controller.signal },
    (req) => {
      return new Response("Hello World\n");
    },
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // Make multiple requests
    const requests = Array(5).fill(null).map(() =>
      fetch("http://127.0.0.1:8000")
    );

    const responses = await Promise.all(requests);

    // All requests should succeed
    for (const response of responses) {
      assertEquals(response.status, 200);
      assertEquals(await response.text(), "Hello World\n");
    }
  } finally {
    controller.abort();
    await server.finished;
  }
});

Deno.test("Server returns correct content type", async () => {
  const controller = new AbortController();
  const server = Deno.serve(
    { port: 8000, hostname: "127.0.0.1", signal: controller.signal },
    (req) => {
      return new Response("Hello World\n");
    },
  );

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    const response = await fetch("http://127.0.0.1:8000");

    // Consume the response body to prevent resource leak
    await response.text();

    // Default content-type should be text/plain
    assertEquals(
      response.headers.get("content-type"),
      "text/plain;charset=UTF-8",
    );
  } finally {
    controller.abort();
    await server.finished;
  }
});
