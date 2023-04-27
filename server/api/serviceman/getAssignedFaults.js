const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  // const { svmId } = req.body
  db.query(
    'SELECT * FROM Faults WHERE ',
    (error, results) => {
      if (error) {
        console.log('Error get assigned faults: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
