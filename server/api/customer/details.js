const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/:id', (req, res) => {
  // console.log(req.params.email)
  db.query(
    'SELECT * FROM customer_details WHERE id = $1',
    [req.params.id],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      // console.log(results)
      res.json(results)
      // res.status(200).json({ message: 'Logged in' });
    }
  )
})

module.exports = router
