const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { name, city, locationId } = req.body
  db.query(
    'INSERT INTO Subcontractor (Name, City, Location_ID) VALUES ($1, $2, $3) RETURNING id',
    [name, city, locationId],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      console.log(results)
      res.json(results)
    }
  )
})

module.exports = router
