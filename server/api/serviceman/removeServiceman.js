// usuwanie svm, usera, timeslotów
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { svmId } = req.body
  db.query(
    'CALL remove_svm($1, 0, \'\')', [svmId],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      // console.log(results)
      res.json(results)
      // res.status(200).json({ message: 'Logged in' });
    })
})

module.exports = router
