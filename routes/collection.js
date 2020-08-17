import express from 'express'
let router = express.Router()
import { getShipList } from '../helpers/collection.js'

router.route('/ship')
  .get(getShipList)


export default router
