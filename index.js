#!/usr/bin/env node
import fs from 'fs';
import { Command } from 'commander/esm.mjs';

const program = new Command();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program.name('towatch-cli');
program.version('0.0.1');
program
  .command('add [movieName]')
  .description('add a movie to the watchlist')
  .action((name) => {
    console.log(`Adding ${name} to the watchlist`);
  });

  
program.parse();
