const express = require('express')
const app = express()
// const cheerio = require('cheerio')
// const axios = require('axios')
const fs = require('fs')
const fsPromise = fs.promises
const ApiSwgohHelp = require('api-swgoh-help')
const statCalculator = require('swgoh-stat-calc');
let gameData = JSON.parse(fs.readFileSync(`./data/game-data.json`))
statCalculator.setGameData( gameData );

const PORT = process.env.PORT || 3000
require('dotenv').config()

const swapi = new ApiSwgohHelp({
    "username":process.env.SWGOH_USERNAME,
    "password":process.env.SWGOH_PASSWORD
})

app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/views/squads'))
app.use(express.static(__dirname + '/public'))

app.get('/test', async (req, res) => {
  let player = (await swapi.fetchPlayer({
  allycode: 488291151,
  language: "eng_us",
  project: {
    roster: {
      defId: 1,
      nameKey: 1,
      gp: 1,
      rarity: 1,
      level: 1,
      gear: 1,
      equipped: 1,
      combatType: 1,
      skills: 1,
      mods: 1,
      relic: 1
    }
  }
}) ).result[0];
statCalculator.calcRosterStats( player.roster );
player.roster.forEach(char => {
  char.gp = statCalculator.calcCharGP(char)
})
res.send(player.roster)
})
app.get('/data', async (req, res) => {
  let payload = {'collection': "unitsList",
           'language': "eng_us",
           'enums': true,
           'match': {
             "rarity": 7,
             "obtainable": true,
             "combatType": 2,
             "obtainableTime": 0,
             "baseId": "EMPERORSSHUTTLE"
           },
            'project': {
              "baseId": 1,
              "nameKey": 1,
              "categoryIdList": 1,
              "combatType": 1,
              "skillReferenceList": 1
            }
           }
  getData(payload)
  .then(results => {
    console.log(results)
    res.send(unwrap(results))
  })
  .catch(err => {
    console.log(err)
    res.send(err)
  })
  // let { result, error, warning } = await swapi.fetchData( payload );
  //test, get all first order people
  //let first_order = result.filter(item => item.categoryIdList.includes("affiliation_firstorder") && item.combatType === "CHARACTER")
  // result.forEach((item => {
  //   if item.categoryIdList.includes("affiliation_firstorder") {
  //     first_order.push(unit)
  //   }
  // })


  //const units  = [ roster[10], roster[20] ];

 //const stats  = await swapi.unitStats(unit,  [ "includeMods","withModCalc","gameStyle" ] );
 // res.send(result)
  //console.log("getting list")
  //let {result, error, warning} = await swapi.fetchData({"collection": "unitsList", "language": "eng_us", "match": {"baseID": "DARTHREVAN"}})
  //console.log(error)
  //console.log(warning)
  // fs.writeFile("./data/units.json", JSON.stringify(result[0], null, '\t'), (err) => {
  //   if (err) {
  //     console.error(err)
  //     return
  //   }
  // })
  //res.send(stats)
})


// caches data
//todo, put all caching on timer
app.get('/cacheRewardTableData', (req, res) => {
  let reward_table = getRewardTable()
  reward_table.then(results => {
    fs.writeFile("./data/reward-table.json", JSON.stringify(results.result, null, '\t'), (err) => {
      if (err) {
        console.error(err)
        return
      }
      res.send("done")
    })
  })
  .catch(err => {
    res.send(err)
  })
})
app.get('/cacheTerritoryBattleData', (req, res) => {
  let territory_battles = getTerritoryBattles()
  territory_battles.then(results => {
    results = results.result
    fs.writeFile("./data/hoth-lstb.json", JSON.stringify(results[0], null, '\t'), (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    fs.writeFile("./data/hoth-dstb.json", JSON.stringify(results[1], null, '\t'), (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    fs.writeFile("./data/geo-dstb.json", JSON.stringify(results[2], null, '\t'), (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    fs.writeFile("./data/geo-lstb.json", JSON.stringify(results[3], null, '\t'), (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    res.send("done")
  })
  .catch(err => {
    res.send(err)
  })
})
app.get('/cacheCategoryList', (req, res) => {
  let categoryList = getCategoryList()
  categoryList.then(results => {
    fs.writeFile("./data/category-list.json", JSON.stringify(results.result, null, '\t'), (err) => {
      if (err) {
        console.log(err)
        return
      }
      res.send("done")
    })
  })
  .catch(err => {
    res.send(err)
  })
})
app.get('/cacheCharacterList', (req, res) => {
  let characterList = getCharacterList()
  characterList.then(results => {
    fs.writeFile("./data/character-list.json", JSON.stringify(results.result, null, '\t'), (err) => {
      if (err) {
        console.log(err)
        return
      }
      res.send("done")
    })
  })
})
app.get('/cacheShipList', (req, res) => {
  let shipList = getShipList()
  shipList.then(results => {
    fs.writeFile("./data/ship-list.json", JSON.stringify(results.result, null, '\t'), (err) => {
      if (err) {
        console.log(err)
        return
      }
      res.send("done")
    })
  })
  .catch(err => {
    res.send(err)
  })
})
app.get('/cacheSelf', (req, res) => {
    cachePlayer(488291151)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      res.send(err)
    })
})
app.get('/cacheHijinx', async (req, res) => {
  cacheGuild(488291151)
  .then(result => {
    res.send(result)
  })
  .catch(err => {
    res.send(err)
  })
})



app.get('/hothLSTB', (req, res) => {
  res.send(getTBData('hoth', 'ls'))
})
app.get('/hothDSTB', (req, res) => {
  res.send(getTBData('hoth', 'ds'))
})
app.get('/geoDSTB', (req, res) => {
  res.send(getTBData('geo', 'ds'))
})
app.get('/geoLSTB', (req, res) => {
  res.send(getTBData('geo', 'ls'))
})

app.get('/guild/:ally_code', async (req, res) => {
  try {
    let allycode = req.params.ally_code
    let guild = await getGuild(allycode)
    res.send(guild)
  } catch (err) {
    res.send(err)
  }
})
app.get('/player/:ally_code', async (req, res) => {
  try {
    let allycode = req.params.ally_code
    let player = await getPlayer(allycode)
    player.roster = player.roster.filter(obj => obj.combatType == 1)
    player.roster.map(obj => obj.gp = statCalculator.calcCharGP(obj))
    res.send(player)
  } catch (err) {
    res.send(err)
  }
})
app.get('/characters', async (req, res) => {
  // getCharacterList
  let characterList = JSON.parse(fs.readFileSync(`./data/character-list.json`))
  res.send(characterList)
})
app.get('/factions', (req, res) => {
  let categoryList = JSON.parse(fs.readFileSync(`./data/category-list.json`))
  res.send(categoryList)
})


app.get('/events', async (req, res) => {
  let {result, error, warning} = await swapi.fetchEvents()
  res.send(result)
})


//TODO later, not sure if still needed
app.get('/units/:ally_code', async (req, res) => {
  // let ally_code = req.params.ally_code
  // let payload = {allycode: ally_code}
  // let result = await swapi.fetchUnits()
  // res.send(getUnits)

  //res.send(result)
  //let {result, error, warning} = await swapi.calcStats(ally_code, null)
  //if (error != null) {
  //  res.send(error)
  //} else {
  //  res.send(result)
  //}
  res.send("TODO")
})

//simple function that returns the needed data for the territory battle
function getTBData(planet, type) {
  //planet is either hoth or geo
  // type is either ls or ds
  let tb_data = JSON.parse(fs.readFileSync(`./data/${planet}-${type}tb.json`))
  //let zone_names = JSON.parse(fs.readFileSync(`./data/zone-names.json`))
  let rewards = JSON.parse(fs.readFileSync(`./data/reward-table.json`))
  let json = []
  tb_data.conflictZoneDefinitionList.forEach(zone => {
    let phase = zone.zoneDefinition.zoneId.match(/^.*(phase0\d).*$/)[1].replace("0", " ")
    phase = phase.replace(/^./, phase[0].toUpperCase())
    let indexOfPhase = json.findIndex(obj => {return obj.name === phase})
    if (indexOfPhase === -1) {
      json.push({name: phase, zones: []})
    }
    indexOfPhase = json.findIndex(obj => {return obj.name === phase})
    let combat_missions = tb_data.strikeZoneDefinitionList.filter(obj => {return obj.zoneDefinition.linkedConflictId === zone.zoneDefinition.zoneId})

    json[indexOfPhase].zones.push({
      name: zone.zoneDefinition.nameKey,
      type: zone.combatType === 1 ? "character" : "ship",
      one_star: zone.victoryPointRewardsList[0].galacticScoreRequirement,
      two_star: zone.victoryPointRewardsList[1].galacticScoreRequirement,
      three_star: zone.victoryPointRewardsList[2].galacticScoreRequirement,
      num_CM: combat_missions.length,
      points_CM: Number(rewards.filter(obj => {return obj.id === combat_missions[0].encounterRewardTableId})[0].rowList.slice(-1)[0].value.split(":")[1]),
      platoon_points: tb_data.reconZoneDefinitionList.filter(obj => {return obj.zoneDefinition.linkedConflictId ===  zone.zoneDefinition.zoneId})[0].platoonDefinitionList.reduce((a,b) => a + (b.reward.value || 0), 0)
    })
  })
  return json
}

// getting collection functions
//  all based on common getData function
//  sole parameter is just name of collection
//  full list of collections is at: https://api.swgoh.help/swgoh

async function getTerritoryBattles() {
  return await getCollection("territoryBattleDefinitionList")
}

async function getRewardTable() {
  return await getCollection("tableList")
}

async function getCategoryList() {
  return await getCollection("categoryList")
}

async function getCharacterList() {
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
  return await getData(payload)
}

async function getShipList() {
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
  return await getData(payload)
}

async function getCollection(collectionName) {
  return await getData({collection: collectionName, language: "eng_us"})
}


//core API functions, call swapi methods and use custom unwrap method
async function getData(payload) {
  return await swapi.fetchData(payload)
}

async function getUnits(payload) {
  return await swapi.fetchUnits(payload)
}

async function getPlayer(allycode) {
  try {
    let path = `./data/players/${allycode}.json`
    if (fs.existsSync(path)) {
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

async function getGuild(allycode) {
  return await swapi.fetchGuild({allycodes: allycode, language: "eng_us"})
}

async function cachePlayer(allycode) {
  try {
    let fetchPlayer = await swapi.fetchPlayer({allycodes: allycode, language: "eng_us"})
    if (fetchPlayer.error) {
      throw fetchPlayer.error
    }
    let playerData = fetchPlayer.result[0]
    await fsPromise.writeFile(`./data/players/${allycode}.json`, JSON.stringify(playerData, null, '\t'))
    return "done"
  } catch(err) {
    return err
  }
}

async function cacheGuild(allycode) {
  try {
    //fetch data from SWGOH.HELP
    let fetchGuild = await swapi.fetchGuild({allycodes: allycode, language: "eng_us"})
    if (fetchGuild.error) {
      throw fetchGuild.error
    }
    //cache data into JSON file
    let data = fetchGuild.result[0]
    let guildId = data.id
    await fsPromise.writeFile(`./data/guilds/${guildId}.json`, data)
    // fetch guild players data from SWGOH.HELP
    let membersAllyCodes = data.roster.map(member => member.allyCode)
    let fetchPlayers = await swapi.fetchPlayer({allycodes: membersAllyCodes, language: "eng_us"})
    if (fetchPlayers.error) {
      throw fetchPlayer.error
    }
    //cache guild player data in json with name <ALLYCODE>
    let members = fetchPlayers.result
    const promises = members.map(async member => {
      let allycode = member.allyCode
      return await fsPromise.writeFile(`./data/players/${allycode}.json`, JSON.stringify(member, null, '\t'))
    })
    await Promise.all(promises)
    return "done"
  } catch (err) {
    throw err
  }
}

function unwrap(results) {
  let {result, error, warning} = results
  if (warning) {
    console.log(warning)
  }
  if (error) {
    throw error
  } else {
    return result
  }
}

app.listen(PORT, async (req, res) => {
  console.log(`Server listening at port ${PORT}`)
})
