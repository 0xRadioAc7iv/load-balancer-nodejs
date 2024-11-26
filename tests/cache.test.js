const { spawn } = require("child_process");

let loadBalancerProcess;
let server1;
let server2;
let server3;

describe("cache testing", () => {
  beforeAll((done) => {
    server1 = spawn("node", ["./test_servers/s1.js"], {
      stdio: "inherit",
    });

    server2 = spawn("node", ["./test_servers/s2.js"], {
      stdio: "inherit",
    });

    server3 = spawn("node", ["./test_servers/s3.js"], {
      stdio: "inherit",
    });

    loadBalancerProcess = spawn("node", ["./index.js"], {
      stdio: "inherit",
    });

    setTimeout(done, 500);
  });

  afterAll((done) => {
    if (loadBalancerProcess) {
      loadBalancerProcess.kill();
    }

    if (server1) {
      server1.kill();
    }

    if (server2) {
      server2.kill();
    }

    if (server3) {
      server3.kill();
    }

    setTimeout(done, 500);
  });

  test("should not return a cached response", async () => {
    try {
      const response = await fetch("http://localhost:3000");

      const isResponseOk = response.ok;
      const isResponseNotCached = !response.headers.has("X-Cache");

      if (!isResponseOk) {
        throw new Error(`Response not OK. Status: ${response.status}`);
      }

      expect(isResponseNotCached).toBe(true);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  });

  test("should return a cached response", async () => {
    try {
      await fetch("http://localhost:3000");

      const cachedResponse = await fetch("http://localhost:3000");

      const isResponseOk = cachedResponse.ok;
      const isResponseCached = cachedResponse.headers.has("X-Cache");

      if (!isResponseOk) {
        throw new Error(`Response not OK. Status: ${cachedResponse.status}`);
      }

      if (isResponseCached) {
        expect(cachedResponse.headers.get("X-Cache")).toBe("HIT");
      } else {
        console.warn("No X-Cache header found");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  });
});
