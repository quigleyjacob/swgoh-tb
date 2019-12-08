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

app.get('/hothLSTB', (req, res) => {
  res.send(getTBData('hoth', 'ls'))
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

app.get('/events', async (req, res) => {
  let {result, error, warning} = await swapi.fetchEvents()
  res.send(result)
})

function getTBData(planet, type) {
  //planet is either hoth or geo
  // type is either ls or ds
  let data = fs.readFileSync(`${planet}-${type}tb.txt`)
  let array = data.toString().split("\n").filter(str => {return /\S/.test(str)})
  array.forEach((v, i, a) => {a[i] = v.trim()})
  let json = []
  array.forEach((val, i, arr) => {
    if (/^Phase \d$/.test(val)) {
      let phase = {
        name: val,
        zones: []
      }
      let numZones = Number(arr[i+1].match(/Number of Zones: (\d)/)[1])
      for (let j = 0; j < numZones; ++j) {
        let name_type = arr[i + 2 + 7*j].match(/(\w*\s?\w*) \((\w+)\)/)
        let one_star = arr[i + 2 + 7*j + 1].match(/1 Star: (\d+)/)
        let two_star = arr[i + 2 + 7*j + 2].match(/2 Star: (\d+)/)
        let three_star = arr[i + 2 + 7*j + 3].match(/3 Star: (\d+)/)
        let num_CM = arr[i + 2 + 7*j + 4].match(/Combat Missions: (\d+)/)
        let points_CM = arr[i + 2 + 7*j + 5].match(/Points per CM: (\d+)/)
        let platoon_points = arr[i + 2 + 7*j + 6].match(/Platoon Points: (\d+)/)
        phase.zones.push({
          name: name_type[1],
          type: name_type[2],
          one_star: Number(one_star[1]),
          two_star: Number(two_star[1]),
          three_star: Number(three_star[1]),
          num_CM: Number(num_CM[1]),
          points_CM: Number(points_CM[1]),
          platoon_points: Number(platoon_points[1])
        })
      }
      json.push(phase)
    }
  })
  return json
}

app.listen(PORT, (req, res) => {
  console.log(`Server listening at port ${PORT}`)
})
