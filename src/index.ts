import { readFileSync, existsSync } from "fs";
import { exit } from "process";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers"

import { Config } from "./types";
import { logger } from "./logger";
import { prepareDatabase } from "./database";
import { fetchPosts, prepareReddit } from "./reddit";
import { postImages, prepareTwitter } from "./twitter";
import { createServer } from "./web";

const options = yargs(hideBin(process.argv))
  .option('web', {
    alias: 'w',
    type: 'boolean',
    default: false,
    description: 'Enable the web server'
  })
  .option('config', {
    alias: 'c',
    type: 'string',
    default: 'config.json',
    description: 'Config file to use'
  })
  .option('port', {
    alias: 'p',
    type: 'number',
    default: 9600,
    description: 'Port for the web server'
  })
  .option('database', {
    alias: 'd',
    type: 'string',
    default: 'posts',
    description: 'Name of the database'
  })
  .parseSync();

const configFile = options.config;
if (!existsSync(configFile)) {
  logger.error("Config file is missing!");
  exit(1);
}

const config = JSON.parse(
  readFileSync(configFile).toString('utf-8')
) as Config;

config.port = options.port;
config.web = options.web;
config.database = options.database;

const FETCH_INTERVAL = 60 * 1000;
const POST_INTERVAL = 60 * 15 * 1000;

prepareDatabase(config).then(async () => {
  prepareTwitter(config);
  prepareReddit(config);

  if (config.web) {
    createServer(config);
  }

  config.subreddits.forEach(subreddit => {
    fetchPosts(subreddit);

    setInterval(() => {
      fetchPosts(subreddit);
    }, FETCH_INTERVAL);
  });

  setInterval(() => {
    postImages(config);
  }, POST_INTERVAL);
});