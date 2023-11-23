import { join } from "node:path";
import fs from "node:fs";
import { ConfigIniParser } from "config-ini-parser";
import assert from "node:assert";

function isDir(path: string): boolean {
  return fs.statSync(path).isDirectory();
}

export default class GitRepository {
  #worktree: string;
  #gitdir: string;
  #conf: ConfigIniParser;

  constructor(path: string, force = false) {
    this.#worktree = path;
    this.#gitdir = join(path, ".git");

    if (!(force || isDir(this.#gitdir))) {
      throw Error(`Not a Git repository ${path}`);
    }

    // Reading the config file
    this.#conf = new ConfigIniParser();
    const cf = repoFile(this, undefined, "config");

    if (cf && fs.existsSync(cf)) {
      const iniContent = fs.readFileSync(cf).toString();
      this.#conf.parse(iniContent);
    } else if (!force) {
      throw Error("Configuration file missing");
    }

    if (!force) {
      const vers: number = +this.#conf.get("core", "repositoryformatversion");
      if (vers != 0) {
        throw Error(`Unsupported repositoryformatversion ${vers}`);
      }
    }
  }

  get gitdir() {
    return this.#gitdir;
  }

  get worktree() {
    return this.#worktree;
  }

  get conf() {
    return this.#conf;
  }
}

/***
 * Compute path under repo's gitdir.
 */
function repoPath(repo: GitRepository, ...paths: string[]): string {
  return join(repo.gitdir, ...paths);
}

function repoFile(
  repo: GitRepository,
  mkdir: boolean = false,
  ...paths: string[]
) {
  if (repoDir(repo, mkdir, ...paths.slice(0, -1))) {
    return repoPath(repo, ...paths);
  }
}

function repoDir(
  repo: GitRepository,
  mkdir: boolean = false,
  ...paths: string[]
): string | undefined {
  const path = repoPath(repo, ...paths);

  if (fs.existsSync(path)) {
    if (isDir(path)) {
      return path;
    }
    throw Error(`Not a directory ${path}`);
  }

  if (mkdir) {
    fs.mkdirSync(path, {
      recursive: true,
    });
    return path;
  }

  return undefined;
}

export function repoCreate(path: string) {
  const repo: GitRepository = new GitRepository(path, true);

  if (fs.existsSync(repo.worktree)) {
    if (!isDir(repo.worktree)) {
      throw Error(`${path} is not a directory!`);
    }

    if (fs.existsSync(repo.gitdir) && fs.readdirSync(repo.gitdir).length) {
      throw Error(`${path} is not empty!`);
    }
  } else {
    fs.mkdirSync(repo.worktree, {
      recursive: true,
    });
  }

  assert(repoDir(repo, true, "branches"));
  assert(repoDir(repo, true, "objects"));
  assert(repoDir(repo, true, "refs", "tags"));
  assert(repoDir(repo, true, "refs", "heads"));

  fs.writeFileSync(
    repoFile(repo, undefined, "description")!,
    "Unnamed repository; edit this file 'description' to name the repository.\n"
  );
  fs.writeFileSync(
    repoFile(repo, undefined, "HEAD")!,
    "ref: refs/heads/master\n"
  );
  fs.writeFileSync(
    repoFile(repo, undefined, "config")!,
    repoDefaultConfig().stringify()
  );
}

function repoDefaultConfig() {
  const parser = new ConfigIniParser();

  parser.addSection("core");
  parser.set("core", "repositoryformatversion", "0");
  parser.set("core", "filemode", "false");
  parser.set("core", "bare", "false");

  return parser;
}
