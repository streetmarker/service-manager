const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { displayName, lat, lon } = req.body
  db.query(
    'INSERT INTO Location (Display_name, Coordinates) VALUES ($1, point($2, $3)) RETURNING id',
    [displayName, lat, lon],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      // const id = results.rows[0].id
      res.json(results)
    }
  )
})

module.exports = router
