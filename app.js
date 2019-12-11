const express = require('express')
const app = express()
const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')
const ApiSwgohHelp = require('api-swgoh-help')
const PORT = process.env.PORT || 3000
require('dotenv').config()

const swapi = new ApiSwgohHelp({
    "username":process.env.SWGOH_USERNAME,
    "password":process.env.SWGOH_PASSWORD
})

app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.render('./index.html')
})

//looking at data for doing misc stuff
app.get('/data', async (req, res) => {
  let {result, error, warning} = await swapi.fetchData({"collection": "categoryList"})
  console.log(error)
  console.log(warning)
  res.send(result)
})
app.get('/squads', async (req, res) => {
  let { result, error, warning } = await swapi.fetchSquads()
  res.send(result)
})
app.get('/events', async (req, res) => {
  let {result, error, warning} = await swapi.fetchEvents()
  res.send(result)
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
  let {result, error, warning} = await swapi.fetchGuild({allycodes: [req.params.ally_code]})
  res.send(result)
})

app.get('/player/:ally_code', async (req, res) => {
  let {result, error, warning} = await swapi.fetchPlayer({allycode: req.params.ally_code})
  if (error) {
    res.send(error)
  } else {
    res.send(result)
  }
})

function getTBData(planet, type) {
  //planet is either hoth or geo
  // type is either ls or ds
  let tb_data = JSON.parse(fs.readFileSync(`./data/${planet}-${type}tb.json`))
  let zone_names = JSON.parse(fs.readFileSync(`./data/zone-names.json`))
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
    console.log(rewards.filter(obj => {return obj.id === zone.zoneDefinition.nameKey}))
    json[indexOfPhase].zones.push({
      name: zone_names[zone.zoneDefinition.zoneId],
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

async function getTerritoryBattles() {
  let {result, error, warning} = await swapi.fetchData({"collection": "territoryBattleDefinitionList"})
  if (warning) {
    console.log(warning)
  }
  if (error) {
    throw error
  } else {
    return result
  }
}
async function getRewardTable() {
  let {result, error, warning} = await swapi.fetchData({"collection": "tableList"})
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
