
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const { createServer } = require("../src/server");

let server;
let baseUrl;

// Start server before tests
before(async () => {
  server = createServer();

  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

// Stop server after tests
after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
});

// TEST 1: Home API
test("Home API returns 200", async () => {
  const response = await fetch(`${baseUrl}/`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(
    data.message,
    "Hello from Node.js and Harness CI!"
  );
  assert.equal(data.version, "1.0.0");
});

// TEST 2: Health API
test("Health API returns healthy", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "healthy");
});

// TEST 3: Info API
test("Info API returns application details", async () => {
  const response = await fetch(`${baseUrl}/info`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(
    data.application,
    "node-harness-ci-demo"
  );
  assert.equal(data.runtime, "Node.js");
});

// TEST 4: Greeting API
test("Hello API returns greeting", async () => {
  const response = await fetch(
    `${baseUrl}/hello?name=Harness`
  );
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.greeting, "Hello, Harness!");
});

// TEST 5: Invalid API
test("Unknown API returns 404", async () => {
  const response = await fetch(
    `${baseUrl}/invalid`
  );
  const data = await response.json();

  assert.equal(response.status, 404);
  assert.equal(data.error, "Not found");
});

// TEST 6: Unsupported HTTP method
test("POST request returns 405", async () => {
  const response = await fetch(`${baseUrl}/`, {
    method: "POST"
  });
  const data = await response.json();

  assert.equal(response.status, 405);
  assert.equal(data.error, "Method not allowed");
});
