import { execFileSync, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const envPath = resolve(root, ".env");
const templatePath = resolve(root, "docs/local-environment.example");

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!existsSync(envPath)) {
  const template = readFileSync(templatePath, "utf8");
  writeFileSync(envPath, template.replace("replace-this-with-a-long-local-only-secret", randomBytes(32).toString("hex")));
  console.log("Created .env with a generated local JWT secret.");
} else {
  console.log("Using existing .env.");
}

try {
  execFileSync("docker", ["compose", "version"], { cwd: root, stdio: "ignore" });
} catch {
  console.error("Docker Compose is required for the default setup. Install Docker Desktop, then run `pnpm setup` again.");
  process.exit(1);
}

console.log("Starting the local MySQL database...");
run("docker", ["compose", "up", "-d", "db"]);
console.log("Waiting for MySQL and applying the schema...");
run("pnpm", ["db:migrate"]);
console.log("\nOnoma is ready. Start the app with `pnpm dev` and open http://localhost:3000.");
