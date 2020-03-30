const express = require('express')
const router = express.Router()

const queries = require('../db/queries')

/* GET  all shows. */
router.get('/shows', async (req, res, next) => {
  try {
    let shows = await queries.getAll()
    res.status(200).json(shows)
  } catch (error) {
    next(error)
  }
})

/* GET single show. */
router.get('/shows/:id', async (req, res, next) => {
  try {
    let show = await queries.getSingle(req.params.id)
    res.status(200).json(show)
  } catch (error) {
    next(error)
  }
})

module.exports = router
