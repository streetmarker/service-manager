const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  db.query(
    `SELECT f.id, f.customer_ID, f.requestdate, f.description, f.faulttype_ID, f.timeslot_id, t.date, t.subcontractor_ID, sb.name,
    f.comments, f.slothour_ID, f.isActive, f.faultstatus_ID, t.serviceman_id, s.users_id, c.city, c.full_name, c.phone, l.display_name FROM Fault f
    LEFT JOIN TimeSlot t ON t.id = f.timeslot_id
    LEFT JOIN Subcontractor sb ON sb.id = t.subcontractor_ID 
    LEFT JOIN Serviceman s ON s.id = t.serviceman_id
    LEFT JOIN Customer c ON c.id = f.customer_id
    LEFT JOIN Location l ON l.id = c.location_id`,
    (error, results) => {
      if (error) {
        console.log('Get faults error: ', error)
        return res.json(error)
      }
      res.json(results)
    }
  )
  // logic for reserving slot
})

module.exports = router
