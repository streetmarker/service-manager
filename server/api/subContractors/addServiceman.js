const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', async (req, res) => {
  const { subcontractorId, qualifications, login, email, roleId } = req.body
  console.log(req.body)
  const res1 = await db.query(
    'INSERT INTO Users (Login, password, Email, Role_ID) VALUES ($1, \'123\', $2, $3) RETURNING id',
    [login, email, roleId]
  )
  console.log('svm add res: ', res1)
  const res2 = await db.query(
    'INSERT INTO Serviceman (Users_ID, Qualifications, Subcontractor_ID) VALUES ($1, $2, $3) RETURNING id',
    [res1.rows[0].id, qualifications, subcontractorId]
  )
  console.log('svm add res: ', res2)
  // ADD SLOTS FOR REST OF THE MONTH
  const year = new Date().getFullYear()
  const day = new Date().getMonth() + 1
  const monthDays = new Date(year, day, 0).getDate()
  const daysLeft = monthDays - new Date().getDate()
  for (let i = 1; i <= daysLeft; i++) {
    // Calculate the date for the current iteration
    const date = new Date()
    date.setDate(date.getDate() + i)
    db.query(
      'insert into timeslot (serviceman_id, subcontractor_id, reserved, "date") values ($1, $2, \'{}\', $3)',
      [res2.rows[0].id, subcontractorId, date])
  }
  res.sendStatus(200)
})

module.exports = router
// (error, results) => {
//   if (error) {
//     return res.json(error)
//   }
//   console.log(results)
//   res.json(results)
// }
