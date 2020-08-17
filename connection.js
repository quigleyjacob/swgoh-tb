import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import ApiSwgohHelp from 'api-swgoh-help';
import pkg from 'swgoh-stat-calc'
let gameData = JSON.parse(fs.readFileSync(`./data/game-data.json`))
pkg.setGameData( gameData );

import dotenv from 'dotenv'
dotenv.config()

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const swapi = new ApiSwgohHelp({
    "username":process.env.SWGOH_USERNAME,
    "password":process.env.SWGOH_PASSWORD,
    verbose: true,
    debug: true
})

export const statCalculator = pkg