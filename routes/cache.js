import express from 'express'
let router = express.Router()
import { cacheGuild, cachePlayer, cacheShipList, cacheCharacterList, cacheCategoryList } from '../helpers/cache.js'

router.route('/guild/:allycode')
  .get(cacheGuild)

router.route('/player/:allycode')
  .get(cachePlayer)

router.route('/shipList')
  .get(cacheShipList)

router.route('/characterList')
  .get(cacheCharacterList)

router.route('/categoryList')
  .get(cacheCategoryList)

export default router
