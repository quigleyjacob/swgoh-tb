import { swapi, __dirname } from '../connection.js'
import { promises } from 'fs'

export async function _getShipList() {
    try {
        let payload = {'collection': "unitsList",
        'language': "eng_us",
        'enums': true,
        'match': {
        "rarity": 7,
        "obtainable": true,
        "combatType": 2,
        "obtainableTime": 0,
        },
        'project': {
        "baseId": 1,
        "nameKey": 1,
        "categoryIdList": 1,
        "combatType": 1,
        "skillReferenceList": 1
        }
        }
        let ships = await swapi.fetchData(payload)
        if (ships.error) {
            throw error
        }
        return ships.result
    } catch (err) {
        throw err
    }
}