#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander/esm.mjs";
import { addToDatabase, showWatchlist, addAction } from "./controller.js";
const STORAGE_PATH = "./storage";

// create database.json if not exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH);
}

if (!fs.existsSync(path.join(STORAGE_PATH, "database.json"))) {
  fs.writeFileSync(path.join(STORAGE_PATH, "database.json"), "[]");
}

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
    showWatchlist();
  });

program.parse();
