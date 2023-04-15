const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { subContractor } = req.body
  db.query(
    'SELECT * FROM main_grid WHERE subcontractor = $1', [subContractor],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
