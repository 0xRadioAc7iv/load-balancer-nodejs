const { spawn } = require("child_process");

let loadBalancerProcess;
let server1;
let server2;
let server3;

describe("no servers available", () => {
  beforeAll((done) => {
    loadBalancerProcess = spawn("node", ["./index.js"], {
      stdio: "inherit",
    });

    setTimeout(done, 1000);
  });

  afterAll((done) => {
    if (loadBalancerProcess) {
      loadBalancerProcess.kill();
    }

    setTimeout(done, 500);
  });

  test("no servers are available", async () => {
    try {
      const response = await fetch("http://localhost:3000");

      const isResponseOk = response.ok;

      expect(isResponseOk).toBe(false);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  });
});

describe("when servers are available", () => {
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

  test("servers are available", async () => {
    try {
      const response = await fetch("http://localhost:3000");

      const isResponseOk = response.ok;

      if (!isResponseOk) {
        throw new Error(`Response not OK. Status: ${response.status}`);
      }

      expect(isResponseOk).toBe(true);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  });
});
