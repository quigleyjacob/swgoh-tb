import { _getShipList, _getCharacterList, _getCategoryList } from '../functions/collection.js'
import { swapi, __dirname } from '../connection.js'
import { promises, existsSync } from 'fs'

export async function getShipList(req, res) {
    try {
        let path = `${__dirname}/data/ship-list.json`
        if (existsSync(path)) {
            let ships = await promises.readFile(path).then(result => JSON.parse(result))
            res.send(ships)
        } else {
            let ships = await _getShipList()
            res.send(ships)
        }
    } catch (err) {
        res.send(err)
    }
}

export async function getCharacterList(req, res) {
    try {
        let path = `${__dirname}/data/character-list.json`
        if (existsSync(path)) {
            let characters = await promises.readFile(path).then(result => JSON.parse(result))
            res.send(characters)
        } else {
            let characters = await _getCharacterList()
            res.send(characters)
        }
    } catch (err) {
        res.send(err)
    }
}

export async function getCategoryList(req, res) {
    try {
        let path = `${__dirname}/data/category-list.json`
        if (existsSync(path)) {
            let categories = await promises.readFile(path).then(result => JSON.parse(result))
            res.send(categories)
        } else {
            let categories = await _getCategoryList()
            res.send(categories)
        }
    } catch (err) {
        res.send(err)
    }
}