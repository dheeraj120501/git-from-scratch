import { CliCommand } from "../index.d";
import cmd_init from "./cmd_init";

const cli_commands: CliCommand[] = [
  // {
  //   name: "add",
  // },
  // {
  //   name: "cat-file",
  // },
  // {
  //   name: "check-ignore",
  // },
  // {
  //   name: "checkout",
  // },
  // {
  //   name: "commit",
  // },
  // {
  //   name: "hash-object",
  // },
  {
    name: "init",
    description: "Create an empty Git repository",
    action: cmd_init,
    args: [
      {
        flag: "path",
        description: "Where to create the repository.",
        defaultValue: ".",
      },
    ],
  },
  // {
  //   name: "log",
  // },
  // {
  //   name: "ls-files",
  // },
  // {
  //   name: "ls-tree",
  // },
  // {
  //   name: "rev-parse",
  // },
  // {
  //   name: "rm",
  // },
  // {
  //   name: "show-ref",
  // },
  // {
  //   name: "status",
  // },
  // {
  //   name: "tag",
  // },
];

export default cli_commands;
