const fs = require("fs");
const path = require("path");

const targets = [".next", ".next-dev", "tsconfig.tsbuildinfo"];

for (const target of targets) {
  const fullPath = path.join(process.cwd(), target);
  fs.rmSync(fullPath, { recursive: true, force: true });
}

console.log("Cleaned Next.js build artifacts.");