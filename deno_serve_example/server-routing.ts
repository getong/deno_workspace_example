// Deno serve example with routing
export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    // Simple routing
    switch (path) {
      case "/":
        return new Response("Welcome to the home page! 🏠", {
          headers: { "content-type": "text/plain" },
        });

      case "/about":
        return new Response("About page - Built with Deno serve", {
          headers: { "content-type": "text/plain" },
        });

      case "/api/hello":
        return new Response(JSON.stringify({ message: "Hello from API!" }), {
          headers: { "content-type": "application/json" },
        });

      case "/api/time":
        return new Response(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            unix: Date.now(),
          }),
          {
            headers: { "content-type": "application/json" },
          },
        );

      default:
        return new Response("404 - Page not found", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
    }
  },
} satisfies Deno.ServeDefaultExport;
