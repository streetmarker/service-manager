const db = require('../pgUtils')
// const io = require('./socket')

const date = new Date()
const hour = date.getHours()
const hours = [0, 7, 9, 11, 13, 15, 17, 19]
const tmp = 9
const input = hours.indexOf(tmp)

async function checkSlots () {
  const result = await db.query(
    `select t."date", t.reserved, u.id from timeslot t
    join serviceman s on s.id = t.serviceman_id
    join users u on u.id = s.users_id
    where $1 = ANY(t.reserved)`, [input]
  )
  return result.rows
}
checkSlots()
  .then((result) => {
    console.log(result, '|', date, '|', hour, '|', input)
    // io.emit('new-data', result)
  })
  .catch((error) => {
    console.error(error)
  })
// db.end()

module.exports = checkSlots
