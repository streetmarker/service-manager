import sendMail from '../functions/sendMail'
const passwoid = require('passwoid/lib/passwoid')
const express = require('express')
const db = require('../../pgUtils')
const router = express.Router()

router.post('/', (req, res) => {
  const { fullName, phone, email, city, locationId, contractStart, contractEnd } = req.body
  const tmpPassword = passwoid(5) // docelowo w UPDATE
  try {
    db.query(
      'INSERT INTO Customer (Full_name, password, Phone, Email, City, Location_ID, Contract_start, Contract_end) VALUES ($1, \'123\', $2, $3, $4, $5, $6, $7) RETURNING id', // TMP PASSWORD
      [fullName, phone, email, city, locationId, contractStart, contractEnd],
      (error, results) => {
        if (error) {
          return res.json(error)
        }
        console.log(results)
        res.json(results)
      }
    )
    const content = '<div><h2>Witaj, ' + fullName + `</h2>
    <p>Zostało utworzone dla Ciebie konto klienta w serwisie.</p>
    <p>Masz już dostęp do panelu obsługi klienta.</p>
    <p>Twoje jednorazowe hasło to:` + tmpPassword + `</p>
    <p>Po zalogowaniu zostaniesz poproszony o jego zmianę.</p>
    <p></p>
    <p>Pozdrawiamy,</p>
    <p>Zespół SM</div>`
    sendMail(email, 'Utworzenie konta SM', content)
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
