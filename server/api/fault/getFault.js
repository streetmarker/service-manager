const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../../pgUtils')
const utils = require('../../../utils/utils')
const router = express.Router()

router.post('/', (req, res) => {
  const { token, faultId } = req.body
  jwt.verify(token, process.env.NUXT_ENV_API_SECRET, (err, decoded) => {
    if (err) {
      console.error('Błąd weryfikacji tokena:', err)
    } else {
      db.query(
        `SELECT f.id, f.customer_ID, f.requestdate, f.description, f.faulttype_ID, f.timeslot_id, t.date, t.subcontractor_ID, sb.name,
        f.slothour_ID, '' as hour, f.isActive, f.faultstatus_ID, t.serviceman_id, s.users_id, c.city, c.full_name, c.phone, l.display_name FROM Fault f
        LEFT JOIN TimeSlot t ON t.id = f.timeslot_id
        LEFT JOIN Subcontractor sb ON sb.id = t.subcontractor_ID 
        LEFT JOIN Serviceman s ON s.id = t.serviceman_id
        LEFT JOIN Customer c ON c.id = f.customer_id
        LEFT JOIN Location l ON l.id = c.location_id
        WHERE f.id = $1`, [faultId],
        (error, results) => {
          if (error) {
            console.log('Get faults error: ', error)
            return res.json(error)
          }
          utils.logger.info({
            label: utils.getFileName(__filename),
            message: JSON.stringify(results.rows)
          })
          res.json(results)
        }
      )
    }
  })
})

module.exports = router
