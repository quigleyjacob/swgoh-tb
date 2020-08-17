import { _cacheGuild, _cachePlayer } from '../functions/cache.js'

export async function cacheGuild(req, res) {
  try {
    let allycode = req.params.allycode
    let guild = await _cacheGuild(allycode)
    res.send(guild)
  } catch (err) {
    res.send(err)
  }
}

export async function cachePlayer(req, res) {
  try {
    let allycode = req.params.allycode
    let player = await _cachePlayer(allycode)
    res.send(player)
  } catch (err) {
    res.send(err)
  }
}


