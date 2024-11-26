const { spawn } = require("child_process");

let loadBalancerProcess;
let server1;
let server2;
let server3;

describe("rate limit testing", () => {
  beforeEach((done) => {
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

    setTimeout(done, 1000);
  });

  afterEach((done) => {
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

    setTimeout(done, 1000);
  });

  test("should allow requests under the limit", async () => {
    for (let i = 0; i < 100; i++) {
      const response = await fetch("http://localhost:3000");
      expect(response.ok).toBe(true);
    }
  });

  test("should block requests exceeding the limit", async () => {
    const rateLimitExceeded = 105;
    let rateLimitResponse;

    for (let i = 0; i < rateLimitExceeded; i++) {
      const response = await fetch("http://localhost:3000");
      if (i >= 100) {
        rateLimitResponse = response;
        expect(rateLimitResponse.ok).toBe(false);
      } else {
        expect(response.ok).toBe(true);
      }
    }

    if (rateLimitResponse) {
      const errorMessage = await rateLimitResponse.text();
      expect(errorMessage).toBe(
        "You have reached your rate limit! Please try again after some time"
      );
    } else {
      throw new Error("Rate limit response was not received.");
    }
  });

  test("should not count failed requests towards the rate limit", async () => {
    for (let i = 0; i < 10; i++) {
      const response = await fetch("http://localhost:3000/nonexistent");
      expect(response.ok).toBe(false);
    }

    for (let i = 0; i < 100; i++) {
      const response = await fetch("http://localhost:3000");
      expect(response.ok).toBe(true);
    }
  });
});
