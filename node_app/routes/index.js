const express = require('express')
const router = express.Router()

const queries = require('../db/queries')

/* GET home page. */
router.get('/shows', async (req, res, next) => {
  try {
    let shows = await queries.getAll()
    res.status(200).json(shows)
  } catch (error) {
    next(error)
  }
})

module.exports = router
