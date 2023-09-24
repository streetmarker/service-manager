/* eslint-disable camelcase */
/* eslint-disable no-console */
import { calculateMatrix } from '../functions/calculateMatrix.js'
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', async (req, res) => {
  try {
    // eslint-disable-next-line prefer-const
    let { clientLocation, city, typeId, date, timeSlot_1 } = req.body
    // MOCK
    if (!clientLocation) {
      const clientLocationTmp = {
        x: 52.225665764,
        y: 21.003833318
      }
      city = 'Warszawa'
      clientLocation = clientLocationTmp
      console.log('MOCK', city)
    }
    // MOCK
    console.log('BODY: ', req.body)
    // get subcontractors in current city
    const res1 = await db.query(
    `SELECT  s.id ,s."name" ,s.city, s.location_id ,l.display_name,l.coordinates  FROM subcontractor s
    LEFT JOIN location l ON s.location_id = l.id
    WHERE s.city = $1`, [city]
    )
    const firms = []
    res1.rows.forEach((element) => {
      firms.push({ firm: element, matrix: calculateMatrix(clientLocation.x, clientLocation.y, element.coordinates.x, element.coordinates.y) })
    })
    // sort firms with matrixes
    const sortedFirms = firms.sort(function (a, b) {
      return a.matrix - b.matrix
    })
    // console.log('SORTED', sortedFirms)
    const start = date + 'T00:00:00.000'
    const end = date + 'T23:59:00.000'
    // get serviceman with preferred slot
    const res2prefer = await db.query(
        `SELECT t.id as slotId, t.reserved, se.qualifications FROM subcontractor su
        LEFT JOIN serviceman se ON se.subcontractor_id = su.id
        LEFT JOIN timeslot t ON t.serviceman_id = se.id
        WHERE se.subcontractor_id = $1
        AND t.date > $2
        AND t.date < $3
        AND NOT ARRAY[$4]::integer[] <@ t.reserved`, [sortedFirms[0].firm.id, start, end, timeSlot_1])
    // get rest of serviceman in case
    const res2rest = await db.query(
        `SELECT t.id as slotId, t.reserved, se.qualifications FROM subcontractor su
        LEFT JOIN serviceman se ON se.subcontractor_id = su.id
        LEFT JOIN timeslot t ON t.serviceman_id = se.id
        WHERE se.subcontractor_id = $1
        AND t.date > $2
        AND t.date < $3`, [sortedFirms[0].firm.id, start, end])
    let freeSlots = []
    console.log('PREFER', res2prefer)
    if (res2prefer.rows.length > 0) {
      freeSlots = res2prefer.rows
    } else {
      freeSlots = res2rest.rows
    }
    console.log(freeSlots)
    console.log(res2prefer.rows.length)
    console.log(res2rest.rows.length)
    // console.log(res2prefer)
    try {
      const availableTechnicians = []
      console.log()
      freeSlots.forEach((element) => {
        if (element && element.qualifications && element.qualifications.includes(typeId)) {
          // console.log('TECHNICIAN', element)
          availableTechnicians.push(element)
        }
      })
      if (availableTechnicians.length === 0) {
        console.log('no slot')
        res.json({ firms, message: 'brak slotów, wybierz inny termin' })
      } else {
      // console.log(availableTechnicians)
        res.json({ firms, availableTechnicians })
      }
    } catch (e) {
      const err = {
        name: e.name,
        message: e.message,
        logs: e.stack
      }
      res.status(500).send(err)
    }
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
