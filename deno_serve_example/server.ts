// Basic Deno serve example
export default {
  async fetch(req: Request): Promise<Response> {
    return new Response("Hello from Deno serve! 🦕", {
      headers: { "content-type": "text/plain" },
    });
  },
} satisfies Deno.ServeDefaultExport;
