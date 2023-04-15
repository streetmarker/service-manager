const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { firmId } = req.body
  db.query(
    `SELECT * FROM serviceman se
    LEFT JOIN subcontractor su ON su.id = se.subcontractor_id
    LEFT JOIN location l on l.id = su.location_id
    LEFT JOIN users u on u.id = se.users_id 
    WHERE su.name = $1`, [firmId],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
