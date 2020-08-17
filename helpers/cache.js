import { _cacheGuild, _cachePlayer, _cacheShipList, _cacheCharacterList, _cacheCategoryList } from '../functions/cache.js'

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

export async function cacheShipList(req, res) {
  try {
    let ships = await _cacheShipList()
    res.send(ships)
  } catch (err) {
    res.send(err)
  }
}

export async function cacheCharacterList(req, res) {
  try {
    let characters = await _cacheCharacterList()
    res.send(characters)
  } catch (err) {
    res.send(err)
  }
}

export async function cacheCategoryList(req, res) {
  try {
    let categories = await _cacheCategoryList()
    res.send(characters)
  } catch (err) {
    res.send(err)
  }
}


