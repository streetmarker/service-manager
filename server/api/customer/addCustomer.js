const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { fullName, phone, email, city, locationId, contractStart, contractEnd } = req.body
  db.query(
    'INSERT INTO Customer (Full_name, Phone, Email, City, Location_ID, Contract_start, Contract_end) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
    [fullName, phone, email, city, locationId, contractStart, contractEnd],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
