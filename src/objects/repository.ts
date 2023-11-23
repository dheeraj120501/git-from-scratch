import { join } from "node:path";
import fs from "node:fs";
import { ConfigIniParser } from "config-ini-parser";
import assert from "node:assert";

// Check if a path is a directory or not
function isDir(path: string): boolean {
  return fs.existsSync(path) && fs.statSync(path).isDirectory();
}

// As most of the work with mygit revolves around working with .git directory and work tree it is abstracted in a class
export default class GitRepository {
  // Path to work tree i.e. repo
  #worktree: string;
  // Path to .git directory for the project
  #gitdir: string;
  // Ini Config parser
  #conf: ConfigIniParser;

  constructor(path: string, force = false) {
    this.#worktree = path;
    this.#gitdir = join(path, ".git");

    // If the .git directory already exist in the path then throw error
    if (!(force || isDir(this.#gitdir))) {
      throw Error(`Not a Git repository ${path}`);
    }

    // Creating a Ini Config Parser
    this.#conf = new ConfigIniParser();
    // Getting path to config file in .git
    const cf = repoFile(this, undefined, "config");

    // Check if the config file exist in .git
    if (cf && fs.existsSync(cf)) {
      // Reading the content of config file
      const iniContent = fs.readFileSync(cf).toString();
      this.#conf.parse(iniContent);
    } else if (!force) {
      throw Error("Configuration file missing");
    }

    if (!force) {
      // Make sure the repositoryformatversion property in core section is 0 only
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

// Compute path under repo's .git directory.
function repoPath(repo: GitRepository, ...paths: string[]): string {
  return join(repo.gitdir, ...paths);
}

// Get the path to a particular file in Repo (.git directory)
function repoFile(
  repo: GitRepository,
  mkdir: boolean = false,
  ...paths: string[]
) {
  if (repoDir(repo, mkdir, ...paths.slice(0, -1))) {
    return repoPath(repo, ...paths);
  }
}

// Create a Directory in .git directory
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

// Initialize a Git Repository
export function repoCreate(path: string) {
  const repo: GitRepository = new GitRepository(path, true);

  // If path doesn't exist then create a directory for path
  if (fs.existsSync(repo.worktree)) {
    // Make sure if path exist then it is a directory with empty or no .git directory
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

  // Make the following directories in .git
  assert(repoDir(repo, true, "branches"));
  assert(repoDir(repo, true, "objects"));
  assert(repoDir(repo, true, "refs", "tags"));
  assert(repoDir(repo, true, "refs", "heads"));

  // Create and write data to description file
  fs.writeFileSync(
    repoFile(repo, undefined, "description")!,
    "Unnamed repository; edit this file 'description' to name the repository.\n"
  );

  // Create and write data to HEAD file
  fs.writeFileSync(
    repoFile(repo, undefined, "HEAD")!,
    "ref: refs/heads/master\n"
  );

  // Create and write data to config file
  fs.writeFileSync(repoFile(repo, undefined, "config")!, repoDefaultConfig());
}

// Return default config content
function repoDefaultConfig(): string {
  const parser = new ConfigIniParser();

  parser.addSection("core");
  parser.set("core", "repositoryformatversion", "0");
  parser.set("core", "filemode", "false");
  parser.set("core", "bare", "false");

  return parser.stringify();
}

// Find the root of current repo reccursively
function repoFind(path = ".", required = true): GitRepository | null {
  path = fs.realpathSync(path);

  if (isDir(join(path, ".git"))) {
    return new GitRepository(path);
  }

  const parent = fs.realpathSync(join(path, ".."));

  // We reached root directory
  if (parent == path) {
    if (required) {
      throw Error("No git directory.");
    }
    return null;
  }

  return repoFind(parent, required);
}
