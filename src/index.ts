import { Command } from "commander";
import cli_commands from "./commands";

function main() {
  const program = new Command();
  program.name("mygit").description("GIT from Scratch").version("0.0.1");

  // Adding all the commands available in cli_commands to mygit
  cli_commands.forEach(({ name, description, action, args, options }) => {
    const command = program
      .command(name)
      .description(description)
      .action(action);

    options?.forEach(({ flag, description }) => {
      command.option(`<${flag}>`, description);
    });

    args?.forEach(({ flag, description, defaultValue }) => {
      command.argument(
        defaultValue ? `[${flag}]` : `<${flag}>`,
        description,
        defaultValue
      );
    });
  });

  program.parse();
}

export { main };
