#!/usr/bin/env node
import fs from 'fs';
import { Command } from 'commander/esm.mjs';
import fetch from 'node-fetch';
const STORAGE_PATH = './storage';


// create database.json if not exists
if (!fs.existsSync(STORAGE_PATH)) {
    fs.mkdirSync(STORAGE_PATH);
    fs.writeFileSync(`${STORAGE_PATH}/database.json`, '[]');
}else{
    fs.writeFileSync(`${STORAGE_PATH}/database.json`, '[]');
}

const program = new Command();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program.name('towatch-cli');
program.version('0.0.1');
program
  .command('add [movieName]')
  .description('add a movie to the watchlist')
  .action((name) => {
    console.log(`Adding ${name} to the watchlist`);
    //https://omdbapi.com/?t=open%20season%202&apikey=key
  });

  
program.parse();
