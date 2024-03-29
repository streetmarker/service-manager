const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/:Login', (req, res) => {
  // console.log(req.params.email)
  db.query(
    'SELECT * FROM user_details WHERE login = $1',
    [req.params.Login],
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
