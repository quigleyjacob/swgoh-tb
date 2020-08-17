import { swapi, __dirname, statCalculator } from '../connection.js'
import { promises, existsSync } from 'fs'
const fsPromise = promises

const _getPlayer = async (req, res) => {
  try {
    let allycode = req.params.allycode
    let player = await getPlayer(allycode)
    player.roster = player.roster.filter(obj => obj.combatType == 1)
    player.roster.map(obj => obj.gp = statCalculator.calcCharGP(obj))
    res.send(player)
  }
  catch (err) {
    res.send(err)
  }
}
export { _getPlayer as getPlayer }

async function getPlayer(allycode) {
    try {
      let path = `${__dirname}/data/players/${allycode}.json`
      if (existsSync(path)) {
        return await fsPromise.readFile(path).then(result => JSON.parse(result))
      } else {
        let fetchPlayer = await swapi.fetchPlayer({allycodes: allycode, language: "eng_us"})
        if (fetchPlayer.error) {
          throw fetchPlayer.error
        }
        return fetchPlayer.result[0]
      }
    } catch (err) {
      throw error
    }
  
  }
