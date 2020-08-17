import express from 'express'
let router = express.Router()
import { getPlayer } from '../helpers/player.js'

router.route('/:allycode')
    .get(getPlayer)

export default router