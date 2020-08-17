import { swapi, __dirname } from '../connection.js'
import { promises } from 'fs'
import { _getShipList } from './collection.js'

export async function _cacheGuild(allycode) {
    try {
      //fetch data from SWGOH.HELP
      let fetchGuild = await swapi.fetchGuild({allycodes: allycode, language: "eng_us"})
      if (fetchGuild.error) {
        throw fetchGuild.error
      }
      //cache data into JSON file
      let data = fetchGuild.result[0]
      let guildId = data.id
      await promises.writeFile(`${__dirname}/data/guilds/${guildId}.json`, JSON.stringify(data, null, '\t'))
      // fetch guild players data from SWGOH.HELP
      let membersAllyCodes = data.roster.map(member => member.allyCode)
      let fetchPlayers = await swapi.fetchPlayer({allycodes: membersAllyCodes, language: "eng_us"})
      if (fetchPlayers.error) {
        throw fetchPlayers.error
      }
      //cache guild player data in json with name <ALLYCODE>
      let members = fetchPlayers.result
      const promises = members.map(async member => {
        let allycode = member.allyCode
        return await promises.writeFile(`${__dirname}/data/players/${allycode}.json`, JSON.stringify(member, null, '\t'))
      })
      await Promise.all(promises)
      return "done"
    } catch (err) {
      throw err
    }
}
  
export async function _cachePlayer(allycode) {
    try {
      let fetchPlayer = await swapi.fetchPlayer({allycodes: allycode, language: "eng_us"})
      if (fetchPlayer.error) {
        throw fetchPlayer.error
      }
      let playerData = fetchPlayer.result[0]
      await promises.writeFile(`${__dirname}/data/players/${allycode}.json`, JSON.stringify(playerData, null, '\t'))
      return "done"
    } catch(err) {
      throw err
    }
  }

export async function _cacheShipList() {
  try {
    let ships = await _getShipList()
    await promises.writeFile(`${dirname}/data/ship-list.json`, JSON.stringify(ships, null, '\t'))
  } catch (err) {
    throw err
  }
}
  