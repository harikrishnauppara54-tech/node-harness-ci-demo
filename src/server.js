
const http = require("node:http");

const appName = "node-harness-ci-demo";
const port = Number(process.env.PORT || 3000);

// Handle incoming HTTP requests
function handler(req, res) {
  const url = new URL(req.url, "http://localhost");

  res.setHeader("Content-Type", "application/json");

  // Allow only GET requests
  if (req.method !== "GET") {
    res.writeHead(405);
    return res.end(JSON.stringify({
      error: "Method not allowed"
    }));
  }

  // Home API
  if (url.pathname === "/") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      message: "Hello from Node.js and Harness CI!",
      version: "1.0.0"
    }));
  }

  // Health check API
  if (url.pathname === "/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "healthy"
    }));
  }

  // Application information API
  if (url.pathname === "/info") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      application: appName,
      runtime: "Node.js"
    }));
  }

  // Greeting API
  if (url.pathname === "/hello") {
    const name = (
      url.searchParams.get("name") || "Developer"
    ).slice(0, 80);

    res.writeHead(200);
    return res.end(JSON.stringify({
      greeting: `Hello, ${name}!`
    }));
  }

  // Invalid route
  res.writeHead(404);
  return res.end(JSON.stringify({
    error: "Not found"
  }));
}

// Create HTTP server
function createServer() {
  return http.createServer(handler);
}

// Start server only when executed directly
if (require.main === module) {
  createServer().listen(port, "0.0.0.0", () => {
    console.log(`Node.js application started on port ${port}`);
  });
}

// Export functions for unit testing
module.exports = { createServer, handler };
