const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM Customer',
    (error, results) => {
      if (error) {
        console.log('Get customers error: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
  // logic for reserving slot
})

module.exports = router
