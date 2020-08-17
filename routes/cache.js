import express from 'express'
let router = express.Router()
import { cacheGuild, cachePlayer } from '../helpers/cache.js'

router.route('/guild/:allycode')
  .get(cacheGuild)

router.route('/player/:allycode')
  .get(cachePlayer)

export default router
