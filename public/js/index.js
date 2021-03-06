let guild_info = []
let tb_info = getTBInfo('hoth', 'LS')
let minStars = 0
let big_number = 1000000000
console.log("hello there")

$('#getGuildForm').submit((e) => {
  e.preventDefault()
  let allycode = $('#allycode')[0].value
  $('#error_message').addClass("hidden")
  $('#loader').text("Looking for Guild")
  $('#loader').addClass("active")
  if (allycode.match(/^\d{9}$/) || allycode.match(/^\d{3}-\d{3}-\d{3}$/)) {
    allycode = allycode.replace(/-/g, "")
    console.log("here")
    getGuildInfo(allycode)
  } else {
    $('#error_message').removeClass("hidden")
    $('#loader').removeClass("active")
  }
})

async function getGuildInfo(allycode) {

  guild_info = await $.get(`/guild/${allycode}`)
  console.log(guild_info)
  if (guild_info) {
    console.log(guild_info)
    $('#guild-name').text(guild_info.name)
    $('#guild-found').removeClass("hidden")
    determineStars(false)
    determineStars(true)
  } else {
    $('#loader').removeClass("active")
    $('#error_message').removeClass("hidden")
  }

}

async function getTBInfo(planet, mode) {
    data = await $.get(`/${planet}${mode}TB`)
    let table = $('#tb-info')
    table.empty()
    data.forEach((phase) => {
      phase.zones.forEach((val, i, arr) => {
        let optional_row = ""
        if (i === 0) {
          optional_row = `<td rowspan=\"${phase.zones.length}\">${phase.name}</td>`
        }
        table.append(`
          <tr>
          ${optional_row}
          <td>${val.name}</td>
          <td>${val.one_star.toLocaleString()}</td>
          <td>${val.two_star.toLocaleString()}</td>
          <td>${val.three_star.toLocaleString()}</td>
          <td>${val.num_CM}</td>
          <td>${val.points_CM.toLocaleString()}</td>
          <td>${val.platoon_points.toLocaleString()}</td>
          </tr>
        `)
      })
    })
    return data
}

function guildCharacterGP() {
  let gp = 0
  guild_info.roster.forEach((member) => {
    gp += member.gpChar
  })
  return gp
}
function guildShipGP() {
  let gp = 0
  guild_info.roster.forEach((member) => {
    gp += member.gpShip
  })
  return gp
}

$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })

$('.button.tb').on('click', (e) => {
  $('.button.tb').removeClass('active')
  e.target.className += ' active'
  let info = e.target.textContent.match(/(\w{2}) (\w{3,4})/)
  tb_info = getTBInfo(info[2].toLowerCase(), info[1])
  if(guild_info.id) {
    determineStars(true)
    determineStars(false)
  }
})

function determineStars(perfect) {
  let charGP = guildCharacterGP()
  let shipGP = guildShipGP()
  let total_stars = 0
  let stars_per_phase = []
  tb_info.then(result => {
    result.forEach((phase) => {

      let remainingCharGP = charGP
      let charPoints = []
      let charStars = []
      let nextCharStar = []

      let remainingShipGP = shipGP
      let shipPoints = []
      let shipStars = []
      let nextShipStar = []
      phase.zones.forEach((zone) => {
        if (perfect) {
          let bonus_points = guild_info.roster.length * zone.num_CM * zone.points_CM + zone.platoon_points
          let num_stars = bonus_points < zone.one_star ? 0 : bonus_points < zone.two_star ? 1 : bonus_points.three_star ? 2 : 3
          let stars = [zone.one_star, zone.two_star, zone.three_star]

          if (zone.type === "ship") {
            shipPoints.push(stars)
            shipStars.push(num_stars)
            nextShipStar.push(num_stars === 3 ? big_number : stars[num_stars] - bonus_points)

          } else {
            charPoints.push(stars)
            charStars.push(num_stars)
            nextCharStar.push(num_stars === 3 ? big_number : stars[num_stars] - bonus_points)

          }
        } else {
          if (zone.type === "ship") {
            nextShipStar.push(zone.one_star)
            shipPoints.push([zone.one_star, zone.two_star, zone.three_star])
            shipStars.push(0)
          } else {
            nextCharStar.push(zone.one_star)
            charPoints.push([zone.one_star, zone.two_star, zone.three_star])
            charStars.push(0)
          }
        }
      })
      // determine stars for ships
      if (shipStars.length > 0) {
        while (Math.min(...nextShipStar) < remainingShipGP) {
          let toRemove = Math.min(...nextShipStar)
          let index = nextShipStar.indexOf(toRemove)
          ++shipStars[index]
          if (shipStars[index] < 3) {
            nextShipStar[index] = shipPoints[index][shipStars[index]]-shipPoints[index][shipStars[index]-1]
          } else {
            nextShipStar[index] = big_number
          }
          remainingShipGP -= toRemove
        }
      }

      // determine stars for Characters
      if (charStars.length > 0) {
        while (Math.min(...nextCharStar) < remainingCharGP) {
          let toRemove = Math.min(...nextCharStar)
          let index = nextCharStar.indexOf(toRemove)
          ++charStars[index]
          if (charStars[index] < 3) {
            nextCharStar[index] = charPoints[index][charStars[index]]-charPoints[index][charStars[index]-1]
          } else {
            nextCharStar[index] = big_number
          }
          remainingCharGP -= toRemove
        }
      }
      stars_per_phase.push([...shipStars, ...charStars].reduce((a,b) => a+b, 0))
    })
    return {stars: stars_per_phase.reduce((a,b) => a+b,0), perfect: perfect}
  }).then(results => {
    $('#error_message').addClass("hidden")
    $('#loader').removeClass("active")
    if (perfect) {
        $('#perfect-run').text(results.stars)
    } else {
        $('#deploy-only').text(results.stars)
    }
  })
}
