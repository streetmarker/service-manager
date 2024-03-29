const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  db.query(
    `SELECT s.id, s.location_id, s.name, s.city, l.display_name FROM Subcontractor s
    LEFT JOIN Location l ON s.location_ID = l.id`,
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
