const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { faultId } = req.body
  db.query(
    'select * from get_comments_by_id($1);', [faultId],
    (error, results) => {
      if (error) {
        console.log('Get comments error: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
  // logic for reserving slot
})

module.exports = router
