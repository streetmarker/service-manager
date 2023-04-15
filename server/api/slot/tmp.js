import { calculateMatrix } from '../functions/calculateMatrix.js'
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { clientId, clientLocation, city, description, typeId, date, timeSlot_1, timeSlot_2 } = req.body
    const results = await db.query(
      `SELECT s.id, s."name", s.city, s.location_id, l.display_name, l.coordinates
       FROM subcontractor s
       LEFT JOIN location l ON s.location_id = l.id
       WHERE s.city = $1
       ORDER BY calculateMatrix($2, $3, l.coordinates.x, l.coordinates.y)
       LIMIT 1`,
      [city, clientLocation.x, clientLocation.y]
    )
    const firm = results.rows[0]
    const servicemen = await db.query(
      `SELECT *
       FROM serviceman se
       LEFT JOIN timeslot t ON t.serviceman_id = se.id
       WHERE se.subcontractor_id = $1
       AND t.date = $2`,
      [firm.id, date]
    )
    const technician = servicemen.rows.find(serviceman => 
      serviceman.qualifications && serviceman.qualifications.includes(typeId)
    )
    if (technician) {
      res.json(technician)
    } else {
      res.json({ message: 'brak slotów, wybierz inny termin' })
    }
  } catch (error) {
    res.json(error)
  } finally {
    db.end()
  }
})

module.exports = router
