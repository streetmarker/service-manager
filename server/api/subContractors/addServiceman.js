const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', async (req, res) => {
  const { subcontractorId, qualifications, login, email } = req.body
  console.log(req.body)
  const res1 = await db.query(
    'INSERT INTO Users (Login, Email, Role_ID) VALUES ($1, $2, $3) RETURNING id',
    [login, email, 3] // 3 technician role
  )
  console.log('svm add res: ', res1)
  const res2 = await db.query(
    'INSERT INTO Serviceman (Users_ID, Qualifications, Subcontractor_ID) VALUES ($1, $2, $3) RETURNING id',
    [res1.rows[0].id, qualifications, subcontractorId],
    (error, results) => {
      if (error) {
        return res.json(error)
      }
      console.log(results)
      res.json(results)
    }
  )
  console.log('svm add res: ', res2)
})

module.exports = router
