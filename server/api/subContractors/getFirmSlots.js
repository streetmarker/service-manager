const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { subContractor, date } = req.body
  const start = date + 'T00:00:00.000'
  const end = date + 'T23:59:00.000'
  db.query(
    `SELECT * FROM v_main_grid 
    WHERE subcontractor = $1 
    AND date > $2
    AND date < $3`, [subContractor, start, end],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
