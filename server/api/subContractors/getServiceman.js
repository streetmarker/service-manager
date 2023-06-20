const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { firmId } = req.body
  db.query(
    `SELECT se.id as svmId, se.qualifications, u.email, u.login, u.isactive FROM serviceman se
    LEFT JOIN subcontractor su ON su.id = se.subcontractor_id
    LEFT JOIN users u on u.id = se.users_id 
    WHERE su.name = $1`, [firmId],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      res.json(results)
    }
  )
})

module.exports = router
