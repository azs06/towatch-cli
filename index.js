#!/usr/bin/env node
import fs from "fs";
import { Command } from "commander/esm.mjs";
const STORAGE_PATH = "./storage";
import { addToDatabase } from "./controller.js";


// create database.json if not exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH);
  fs.writeFileSync(`${STORAGE_PATH}/database.json`, "[]");
} else {
  fs.writeFileSync(`${STORAGE_PATH}/database.json`, "[]");
}

const program = new Command();


program.name("towatch-cli");
program.version("1.0.0");
program
  .command("add [movieName]")
  .description("add a movie to the watchlist")
  .action((name) => {
    console.log(`Adding ${name} to the watchlist`);
    addToDatabase(name);
  });

program.parse();
