#!/usr/bin/env node
import { Command } from "commander/esm.mjs";
import { showAction, addAction } from "./controller.js";
import { initDatabase } from "./database.js";


await initDatabase();

const program = new Command();

program.name("towatch-cli");
program.version("1.0.0");

program
  .command("add [movieName]")
  .description("add a movie to the watchlist")
  .action((name) => {
    console.log(`Adding ${name} to the watchlist`);
    addAction(name);
  });
program
  .command("list")
  .description("list all movies in the watchlist")
  .action(() => {
    console.log("Listing all movies in the watchlist");
    showAction();
  });

program.parse();
