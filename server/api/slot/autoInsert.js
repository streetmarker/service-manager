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
    RIGHT JOIN serviceman se on se.subcontractor_id = su.id`
  )
  return result.rows
}
getFirms()
  .then((result) => {
    // console.log(result)
    const year = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1
    const monthDays = new Date(year, currentMonth, 0).getDate()
    const nextMonthDays = new Date(year, currentMonth + 1, 0).getDate()
    const daysToInsert = monthDays + nextMonthDays
    // insert slots for next month (auto insert on last day of the month)
    result.forEach((element) => {
      console.log(element)
      for (let i = 0; i <= daysToInsert; i++) {
        // Calculate the date for the current iteration
        const date = new Date()
        date.setDate(date.getDate() + i)

        if (date.getDate() === 1) { // block adding slots for next month
          break
        }
        db.query(
          'insert into timeslot (serviceman_id, subcontractor_id, reserved, "date") values ($1, $2, \'{}\', $3)',
          [element.svmid, element.subid, date]
        )
        console.log(date)
      }
    })
  })
  .catch((error) => {
    console.error(error)
  })
