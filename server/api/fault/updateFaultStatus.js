const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { statusId, faultId } = req.body
  db.query(
    `UPDATE Fault
    SET faultstatus_id = $1
    WHERE id = $2`, [statusId, faultId],
    (error, results) => {
      if (error) {
        console.log('Error update fault status: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
