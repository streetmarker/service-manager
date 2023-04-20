#!/usr/bin/env node
/* eslint-disable no-console */
// chmod +x /path/to/your/script.js
// ./path/to/your/script.js
// 0 0 * * * /path/to/your/script.js
// To run a script on the 1st day of every month, you can use the following cron expression:
// 0 0 1 * *
// crontab -e

const db = require('../../pgUtils')
// ******************************
// TODO przydzielenie slotów dla aktywnych techników
// skrypt przeznaczony do uruchamiania automatycznie przez Node w interwale
async function getFirms () {
  const result = await db.query(
    `SELECT su.id as subId, se.id as svmId FROM Subcontractor su
    LEFT JOIN serviceman se on se.subcontractor_id = su.id`
  )
  return result.rows
}
getFirms()
  .then((result) => {
    // console.log(result)
    result.forEach((element) => {
      console.log(element)
      for (let i = 1; i < 2; i++) {
        // Calculate the date for the current iteration
        const date = new Date()
        date.setDate(date.getDate() + i)

        // Format the date as a string in ISO format
        // const isoDate = date.toISOString()
        db.query(
          'insert into timeslot (serviceman_id, subcontractor_id, reserved, "date") values ($1, $2, \'{}\', $3)',
          [element.svmid, element.subid, date]
        )
      }
    })
  })
  .catch((error) => {
    console.error(error)
  })
