// Deno serve example with static file serving
import { extname } from "https://deno.land/std@0.224.0/path/mod.ts";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    let path = url.pathname;

    // Serve index.html for root path
    if (path === "/") {
      path = "/index.html";
    }

    // Prevent directory traversal
    if (path.includes("..")) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      // Construct file path (assuming public directory)
      const filePath = `./public${path}`;

      // Read the file
      const file = await Deno.readFile(filePath);

      // Determine content type
      const ext = extname(filePath);
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      return new Response(file, {
        headers: {
          "content-type": contentType,
          "cache-control": "public, max-age=3600",
        },
      });
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // Try to serve a 404.html if it exists
        try {
          const notFoundPage = await Deno.readFile("./public/404.html");
          return new Response(notFoundPage, {
            status: 404,
            headers: { "content-type": "text/html" },
          });
        } catch {
          return new Response("404 - File not found", {
            status: 404,
            headers: { "content-type": "text/plain" },
          });
        }
      }

      // Handle other errors
      console.error("Error serving file:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { "content-type": "text/plain" },
      });
    }
  },
} satisfies Deno.ServeDefaultExport;
