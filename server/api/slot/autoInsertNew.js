const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()
// NOT USED
router.post('/', (req, res) => {
  const { svmId, subcontractorId } = req.body
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const monthDays = new Date(year, month, 0).getDate()
  const daysLeft = monthDays - new Date().getDate()
  for (let i = 0; i <= daysLeft; i++) {
    // Calculate the date for the current iteration
    const date = new Date()
    date.setDate(date.getDate() + i)
    db.query(
      'insert into timeslot (serviceman_id, subcontractor_id, reserved, "date") values ($1, $2, \'{}\', $3)',
      [svmId, subcontractorId, date])
  }
})

module.exports = router
