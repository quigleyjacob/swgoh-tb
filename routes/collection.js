import express from 'express'
let router = express.Router()
import { getShipList, getCharacterList, getCategoryList } from '../helpers/collection.js'

router.route('/ship')
  .get(getShipList)

router.route('/character')
  .get(getCharacterList)

router.route('/category')
  .get(getCategoryList)


export default router
