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

/* POST (add new) show. */
router.post('/shows', async (req, res, next) => {
  try {
    let showID = await queries.add(req.body)
    try {
      let show = await queries.getSingle(showID)
      res.status(200).json(show)
    } catch (error) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

/* PUT (update) show. */
router.put('/shows/:id', async (req, res, next) => {
  if (req.body.hasOwnProperty('id')) {
    return res.status(422).json({
      error: 'You cannot update the id field',
    })
  }
  try {
    let showID = await queries.update(req.params.id, req.body)
    try {
      let show = await queries.getSingle(req.params.id)
      res.status(200).json(show)
    } catch (error) {
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
