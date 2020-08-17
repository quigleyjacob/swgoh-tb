import { _getShipList } from '../functions/collection.js'
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