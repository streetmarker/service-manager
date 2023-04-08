const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { subContractor } = req.body
  db.query(
    'SELECT * FROM TimeSlot WHERE Subcontractor = $1', [subContractor],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
