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

router.post('/', async (req, res) => {
  const { clientLocation, city, typeId, date } = req.body
  // console.log('BODY: ', req.body)
  const res1 = await db.query(
    `SELECT  s.id ,s."name" ,s.city, s.location_id ,l.display_name,l.coordinates  FROM subcontractor s
    LEFT JOIN location l ON s.location_id = l.id
    WHERE s.city = $1`, [city]
    // (error, results) => {
    //   if (error) {
    //     return res.json(error)
    //   } else {
    //     res.json(results)
    //   }
  )
  // res.json(results)
  // console.log('res1: ', results)
  // console.log('matrix', calculateMatrix)
  // console.log(res1)
  const firms = []
  res1.rows.forEach((element) => {
    firms.push({ firm: element, matrix: calculateMatrix(clientLocation.x, clientLocation.y, element.coordinates.x, element.coordinates.y) })
  })
  // console.log('sorted firms: ', firms.sort())
  const sortedFirms = firms.sort()
  const res2 = await db.query(
        `SELECT * FROM subcontractor su
        LEFT JOIN serviceman se ON se.subcontractor_id = su.id
        LEFT JOIN timeslot t ON t.serviceman_id = se.id
        WHERE se.subcontractor_id = $1
        AND t.date = $2`, [sortedFirms[0].firm.id, date])
  // (error, results) => {
  //   if (error) {
  //     return res.json(error)
  //   }
  // const data = results.rows
  // console.log(res2)
  if (res2.rows) {
    try {
      const availableTechnicians = []
      res2.rows.forEach((element) => {
        if (element && element.qualifications && element.qualifications.includes(typeId)) {
          console.log('TECHNICIAN', element)
          availableTechnicians.push(element)
        }
      })
      if (availableTechnicians.length === 0) {
        console.log('no slot')
        res.json({ message: 'brak slotów, wybierz inny termin' })
      } else {
        res.json(availableTechnicians)
      }
    } catch (err) {
      console.log('no slot catch')
      console.log(err)
      res.json({ message: 'brak slotów, wybierz inny termin' })
    }
  } else {
    console.log('no res2.rows')
    res.json({ message: 'brak slotów, wybierz inny termin' })
  }
  // db.end()
})

module.exports = router
