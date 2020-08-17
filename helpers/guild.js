import { swapi, __dirname } from '../connection.js'
import { promises, existsSync } from 'fs'

export async function getGuild(req, res) {
  try {
    let allycode = req.params.allycode
    let guild = await _getGuild(allycode)
    res.send(guild)
  }
  catch (err) {
    res.send(err)
  }
}



async function _getGuild(allycode) {
    //TODO
    // check if user exists in player data
    // if so, check if their guild exists in guild data
    // if so, then get that data and return it
    // otherwise, use swapi call to fetch guild
    try {
      let path = `${__dirname}/data/players/${allycode}.json`
      if (existsSync(path)) {
        let player = await promises.readFile(path).then(result => JSON.parse(result))
        let guildId = player.guildRefId
        path = `${__dirname}/data/guilds/${guildId}.json`
        if(existsSync(path)) {
          return await promises.readFile(path).then(result => JSON.parse(result))
        }
      }
      let fetchGuild = await swapi.fetchGuild({allycodes: allycode, language: "eng_us"})
      if (fetchGuild.error) {
        throw fetchGuild.error
      }
      return fetchGuild.result[0]
    } catch (err) {
      throw err
    }
  
  }