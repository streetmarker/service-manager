/* eslint-disable no-console */
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  // eslint-disable-next-line no-var
  var { customerId, description, faultTypeId, timeSlotId, slotHourId } = req.body
  console.log('Create Fault: ', req.body)
  try {
    // MOCK
    if (customerId == null) {
      customerId = 1
    }
    // MOCK
    db.query(
      `INSERT INTO Fault (Customer_ID, RequestDate, Description, FaultType_ID, TimeSlot_ID, Comments, SlotHour_ID, IsActive, FaultStatus_ID )
      VALUES ($1, current_timestamp, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, [customerId, description, faultTypeId, timeSlotId, null, slotHourId, true, null],
      async (error, results) => {
        if (error) {
          console.log('Create Fault error: ', error)
          return res.json({ message: 'Wystąpił problem skontaktuj sie z obsługą lub spróbuj ponownie później' })
        }
        // reserve slot logic
        // get reserved array
        const reserved = await db.query(
          'SELECT reserved FROM TimeSlot t WHERE t.id = $1', [timeSlotId])
        const reservedUpdate = reserved.rows[0].reserved
        reservedUpdate.push(slotHourId)
        // insert updated array
        db.query(
          'UPDATE TimeSlot t SET reserved = ($1) WHERE id = $2', [reservedUpdate, timeSlotId]
        )
        console.log(results)
        res.json({ results, message: 'Termin zarezerwowany' })
      })
  } catch (e) {
    const err = {
      name: e.name,
      message: e.message,
      logs: e.stack
    }
    res.status(500).send(err)
  }
})

module.exports = router
