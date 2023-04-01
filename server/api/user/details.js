const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/:email', (req, res) => {
  // console.log(req.params.email)
  db.query(
    'SELECT * FROM user_details WHERE email = $1',
    [req.params.email],
    (error, results) => {
      if (error) {
        throw error
      }
      // console.log(results)
      res.json(results)
      // res.status(200).json({ message: 'Logged in' });
    }
  )
})

module.exports = router
