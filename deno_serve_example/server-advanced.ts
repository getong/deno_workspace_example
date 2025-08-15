// Advanced Deno serve example with request handling
export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // Handle different HTTP methods
    if (path === "/api/users" && method === "GET") {
      // Simulate fetching users
      const users = [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" },
      ];

      return new Response(JSON.stringify(users), {
        headers: { "content-type": "application/json" },
      });
    }

    if (path === "/api/users" && method === "POST") {
      try {
        const body = await req.json();

        // Validate request body
        if (!body.name || !body.email) {
          return new Response(
            JSON.stringify({ error: "Name and email are required" }),
            {
              status: 400,
              headers: { "content-type": "application/json" },
            },
          );
        }

        // Simulate creating a user
        const newUser = {
          id: Math.floor(Math.random() * 1000),
          name: body.name,
          email: body.email,
          createdAt: new Date().toISOString(),
        };

        return new Response(JSON.stringify(newUser), {
          status: 201,
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
    }

    // Handle form data
    if (path === "/api/upload" && method === "POST") {
      const contentType = req.headers.get("content-type") || "";

      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (file) {
          return new Response(
            JSON.stringify({
              message: "File received",
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            }),
            {
              headers: { "content-type": "application/json" },
            },
          );
        }
      }

      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Handle query parameters
    if (path === "/api/search") {
      const query = url.searchParams.get("q");
      const limit = parseInt(url.searchParams.get("limit") || "10");

      return new Response(
        JSON.stringify({
          query: query || "No query provided",
          limit: limit,
          results: [],
        }),
        {
          headers: { "content-type": "application/json" },
        },
      );
    }

    // Handle headers
    if (path === "/api/headers") {
      const userAgent = req.headers.get("user-agent");
      const authorization = req.headers.get("authorization");

      return new Response(
        JSON.stringify({
          userAgent: userAgent || "Unknown",
          authorized: !!authorization,
          allHeaders: Object.fromEntries(req.headers.entries()),
        }),
        {
          headers: {
            "content-type": "application/json",
            "x-custom-header": "Deno serve example",
          },
        },
      );
    }

    // Default 404 response
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain" },
    });
  },
} satisfies Deno.ServeDefaultExport;
