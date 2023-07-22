/* eslint-disable camelcase */
/* eslint-disable no-console */
import { calculateMatrix } from '../functions/calculateMatrix.js'
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

// pobranie firm dla miasta
// jeżeli są to
// select firm join lokalizacja +do jednego select podpięte
// wyliczenie odleglosci dla kazdej lokalizacji firm i wybranie najrótrzej

// jeżeli nie ma info dla usera
// ew. todo wprowadzenie wojewodztw albo lepiej wyliczenie dla wszystkich lecz niech zatrzyma jak znajdzie > 30 km inaczej info o kontakt do BO

// select servisantów dla firmy
// ...

// TODO obsługa gdy brak preferowanej godziny na dzień to wyszukać u innego DONE?

router.post('/', async (req, res) => {
  try {
    const { clientLocation, city, typeId, date, timeSlot_1 } = req.body
    console.log('BODY: ', req.body)
    const res1 = await db.query(
    `SELECT  s.id ,s."name" ,s.city, s.location_id ,l.display_name,l.coordinates  FROM subcontractor s
    LEFT JOIN location l ON s.location_id = l.id
    WHERE s.city = $1`, [city]
    )
    const firms = []
    res1.rows.forEach((element) => {
      firms.push({ firm: element, matrix: calculateMatrix(clientLocation.x, clientLocation.y, element.coordinates.x, element.coordinates.y) })
    })

    const sortedFirms = firms.sort(function (a, b) {
      return a.matrix - b.matrix
    })
    const start = date + 'T00:00:00.000'
    const end = date + 'T23:59:00.000'
    const res2prefer = await db.query(
        `SELECT t.id as slotId, t.reserved, se.qualifications FROM subcontractor su
        LEFT JOIN serviceman se ON se.subcontractor_id = su.id
        LEFT JOIN timeslot t ON t.serviceman_id = se.id
        WHERE se.subcontractor_id = $1
        AND t.date > $2
        AND t.date < $3
        AND NOT ARRAY[$4]::integer[] <@ t.reserved`, [sortedFirms[0].firm.id, start, end, timeSlot_1])
    const res2rest = await db.query(
        `SELECT t.id as slotId, t.reserved, se.qualifications FROM subcontractor su
        LEFT JOIN serviceman se ON se.subcontractor_id = su.id
        LEFT JOIN timeslot t ON t.serviceman_id = se.id
        WHERE se.subcontractor_id = $1
        AND t.date > $2
        AND t.date < $3`, [sortedFirms[0].firm.id, start, end])
    let freeSlots = []
    if (res2prefer.rows.length > 0) {
      freeSlots = res2prefer.rows
    } else {
      freeSlots = res2rest.rows
    }
    // console.log(freeSlots)
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
    } catch (err) {
      console.log('no slot catch')
      console.log(err)
      res.json({ firms, message: 'brak slotów, wybierz inny termin' })
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
