import express from 'express'
let router = express.Router()
import { getGuild } from '../helpers/guild.js'

router.route('/:allycode')
    .get(getGuild)

export default router