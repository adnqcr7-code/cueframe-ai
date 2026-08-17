import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const templatePath = resolve(root, "docs/local-environment.example");

function run(command, args, options = {}) {
  return execFileSync(command, args, { cwd: root, stdio: "inherit", ...options });
}

function output(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8" }).trim();
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function waitForDatabase() {
  const containerId = output("docker", ["compose", "ps", "-q", "db"]);
  if (!containerId) throw new Error("Docker started without creating the MySQL container.");
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const health = output("docker", ["inspect", "--format", "{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}", containerId]);
    if (health === "healthy") return;
    if (health === "unhealthy") throw new Error("MySQL reported an unhealthy state.");
    process.stdout.write(`  MySQL is still starting (${attempt}/30)\r`);
    await sleep(2000);
  }
  throw new Error("MySQL did not become healthy within 60 seconds.");
}

async function main() {
  if (!existsSync(envPath)) {
    const template = readFileSync(templatePath, "utf8");
    writeFileSync(envPath, template.replace("replace-this-with-a-long-local-only-secret", randomBytes(32).toString("hex")));
    console.log("Created .env with a generated local JWT secret.");
  } else {
    console.log("Using existing .env.");
  }

  try {
    output("docker", ["compose", "version"]);
  } catch {
    console.error("Docker Compose is required for the default setup. Install Docker Desktop, start it, and run `pnpm setup` again.");
    process.exit(1);
  }

  try {
    console.log("Starting the local MySQL database...");
    run("docker", ["compose", "up", "-d", "db"]);
    console.log("Waiting for MySQL to become healthy...");
    await waitForDatabase();
    console.log("\nApplying the database schema...");
    run("pnpm", ["db:migrate"]);
  } catch (error) {
    console.error("\nSetup could not finish.");
    console.error("Check that Docker is running and that port 3306 is available, then try `pnpm setup` again.");
    if (error instanceof Error) console.error(`Details: ${error.message}`);
    process.exit(1);
  }

  console.log("\nOnoma is ready. Start the app with `pnpm dev` and open http://localhost:3000.");
}

await main();
