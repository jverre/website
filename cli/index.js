#!/usr/bin/env node

const COMMANDS = {
  "setup-firecracker": {
    description: "Install Firecracker & Jailer (Linux native, macOS via Lima)",
    run: () => require("./commands/setup-firecracker").run(),
  },
};

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log("");
  console.log("  Usage: website-cli <command> [options]");
  console.log("");
  console.log("  Commands:");
  for (const [name, cmd] of Object.entries(COMMANDS)) {
    console.log(`    ${name.padEnd(24)} ${cmd.description}`);
  }
  console.log("");
  console.log("  Run 'website-cli <command> --help' for command-specific options.");
  console.log("");
  process.exit(0);
}

if (!COMMANDS[command]) {
  console.error(`Unknown command: ${command}`);
  console.error(`Run 'website-cli --help' to see available commands.`);
  process.exit(1);
}

COMMANDS[command].run();
