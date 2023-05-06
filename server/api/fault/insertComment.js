const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { login, value, faultId } = req.body
  db.query(
    `UPDATE Fault
    SET Comments = array_cat(Comments, ARRAY[($1, $2)]::comment[])
    WHERE ID = $3;`, [login, value, faultId],
    (error, results) => {
      if (error) {
        console.log('Error insert comment: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
