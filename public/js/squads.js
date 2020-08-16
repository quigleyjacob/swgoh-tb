let dev = true

let factions = []
let characters = []
let selectedCharacters = []
let selectedFactions = []
let player = {}
let filteredPlayerCharacters = []
let textEntryValue = ""

getFactions()
getCharacters()


//for dev
if (dev) {
  getSelf()
}

$('#allycode-form').submit(async e => {
  e.preventDefault()
  let allycode = e.target.elements[0].value
  getPlayer(allycode)
  .then(data => {
    player = data
    console.log(player.allyCode)
    //add sortable buttons
    $('#sort-buttons').append(`
      <button class=\"ui button\">Power</button>
      `)
  })
})

$('#text-entry').keyup((e) => {
    textEntryValue = e.target.value
    filterCharacters()
})

async function getPlayer(allycode) {
  return (await $.get(`/player/${allycode}`))
}

async function getCharacters() {
  characters = await $.get('/characters')
  filterCharacters()
}

function filterCharacters() {
  selectedCharacters = characters.filter(character => {
    // console.log(character)
    return selectedFactions.every(faction => character.categoryIdList.includes(faction)) && character.nameKey.toLowerCase().includes(textEntryValue.toLowerCase())
  })
  if (player.allyCode) {
    //if an allycode has been entered, then we want to get the informaion in the player character to be displayed
    let char_ids = selectedCharacters.map(char => char.baseId)
    selectedCharacters = player.roster.filter(character => {
      return char_ids.includes(character.defId)
    })
  }
  refreshCharacters()
}

async function getFactions() {
  factions = await $.get('/factions')
  factions = factions.filter(obj => obj.visible == true && obj.id != "role_capital" && obj.id != "shipclass_cargoship")
  factions = factions.sort((a,b) => a.descKey.localeCompare(b.descKey))
  let factionList = $('#factions')
  factions.forEach(faction => {
    factionList.append(`
      <div class="ui checkbox">
        <input type="checkbox" id="${faction.id}" name="${faction.id}" value="${faction.descKey}">
        <label for="${faction.id}"> ${faction.descKey}</label>
      </div>
      `)
  })
  $(".ui.checkbox").click(e => {
    //if checked, then add to faction list
    if (e.target.checked) {
      selectedFactions.push(e.target.name)
    // unchecked, so remove from faction list
    } else {
      let toRemove = selectedFactions.indexOf(e.target.name)
      selectedFactions.splice(toRemove, 1)
    }
    filterCharacters()
  })
}

function refreshCharacters() {
  let characterList = $('#characters')
  characterList.empty()

  if (player.allyCode) {
    selectedCharacters.forEach(character => {
      let char = characters.filter(obj => obj.baseId == character.defId)[0]
      let alignment = char.categoryIdList[0] == "alignment_light" ? "light" : "dark"
      let zetas = character.skills.filter(obj => obj.isZeta && obj.tier == obj.tiers).length
      characterList.append(`
        <div id=${character.defId} class="ui card">
          <div class="collection-char collection-char-${alignment}-side">
            <div class="player-char-portrait char-portrait-full char-portrait-full-gear-t${character.gear} char-portrait-full-alignment-${alignment}-side">
              <img class="char-portrait-full-img loading" src="https://swgoh.gg/game-asset/u/${character.defId}/" alt="${character.nameKey}" height="80" width="80" data-was-processed="true">
              <div class="char-portrait-full-gear"></div>
              <div class="star star1 ${character.rarity < 1 ? "star-inactive": ""}"></div>
              <div class="star star2 ${character.rarity < 2 ? "star-inactive": ""}"></div>
              <div class="star star3 ${character.rarity < 3 ? "star-inactive": ""}"></div>
              <div class="star star4 ${character.rarity < 4 ? "star-inactive": ""}"></div>
              <div class="star star5 ${character.rarity < 5 ? "star-inactive": ""}"></div>
              <div class="star star6 ${character.rarity < 6 ? "star-inactive": ""}"></div>
              <div class="star star7 ${character.rarity < 7 ? "star-inactive": ""}"></div>
              ${zetas > 0 ? `<div class="char-portrait-full-zeta">${zetas}</div>`: ""}
              ${character.relic.currentTier > 2 ? `<div class="char-portrait-full-relic">${(character.relic.currentTier-2)}</div>`: ""}
              <div class="char-portrait-full-level">${character.level}</div>
            </div>

            <div class="collection-char-name">
            ${character.nameKey}
            <p>${character.gp}<p>
            </div>

          </div>
        </div>
        `)
    })
  } else {
    //otherwise, just show name and image of character
    selectedCharacters.forEach(character => {
      characterList.append(`
        <div id=${character.baseId} class=\"ui card\">
          <div class=image>
            <img class="profile" src=https://swgoh.gg/game-asset/u/${character.baseId}/>
          </div>
          <div class=content>
            <span>${character.nameKey}</span>
          </div>
        </div>
        `)
    })
  }
}

function getSelf() {
  getPlayer(488291151)
  .then(data => {
      console.log(data)
      player = data
      $('#sort-buttons').append(`
        <button class=\"ui button sort increasing\" name=gp>Power</button>
        <button class=\"ui button sort increasing\" name=rarity>Stars</button>
        <button class=\"ui button sort increasing\" name=gear>Gear</button>
        <button class=\"ui button sort increasing\" name=level>Level</button>
        `)
      $('.sort').click(e => {
        let criteria = e.target.name
        selectedCharacters.sort((a,b) => {
          return -(a[criteria] - b[criteria])
        })
        console.log(selectedCharacters)
        refreshCharacters()
      })
      filterCharacters()

  })
}
