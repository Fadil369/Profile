// Vite plugin: after the build is written, emit dist/release.json — the git commit it was built from,
// the release notes, and the SHA-256 of every shipped file. The page re-hashes what it loaded against
// this manifest (src/bpr/release.ts), and anyone can rebuild the commit and compare the hashes.
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const git = (args) => {
  try {
    return execSync(`git ${args}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export default function releaseManifest() {
  return {
    name: "release-manifest",
    apply: "build",
    writeBundle(options) {
      const dir = options.dir;
      const files = {};
      for (const p of walk(dir).sort()) {
        const rel = relative(dir, p).split("\\").join("/");
        if (rel === "release.json") continue;
        files[rel] = createHash("sha256").update(readFileSync(p)).digest("hex");
      }
      const commit = git("rev-parse HEAD");
      const manifest = {
        repo: "https://github.com/Fadil369/Profile",
        commit,
        short: commit.slice(0, 7),
        branch: git("rev-parse --abbrev-ref HEAD"),
        // Built from a tree with uncommitted changes: the hashes cannot be reproduced from the commit.
        dirty: git("status --porcelain -- .") !== "",
        builtAt: new Date().toISOString(),
        notes: JSON.parse(readFileSync(new URL("./release-notes.json", import.meta.url), "utf8")),
        files,
      };
      writeFileSync(join(dir, "release.json"), JSON.stringify(manifest, null, 2) + "\n");
    },
  };
}
