const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM FaultStatus',
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
