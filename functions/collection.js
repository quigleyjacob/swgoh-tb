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
            throw ships.error
        }
        return ships.result
    } catch (err) {
        throw err
    }
}

export async function _getCharacterList() {
    try {
        let payload = {'collection': "unitsList",
        'language': "eng_us",
        'enums': true,
        'match': {
          "rarity": 7,
          "obtainable": true,
          "combatType": 1,
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
        let characters = await swapi.fetchData(payload)
        if (characters.error) {
            throw characters.error
        }
        return characters.result
    } catch (err) {
        throw err
    }
}

export async function _getCategoryList() {
    try {
        let payload = {
            collection: 'categoryList',
            language: 'eng_us'
        }
        let categories = await swapi.fetchData(payload)
        if (categories.error) {
            throw categories.error
        }
        return categories.result
    } catch (err) {
        throw err
    }
}

