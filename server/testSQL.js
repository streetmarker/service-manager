const db = require('./pgUtils')

async function getFirms () {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  console.log(date)
  const s = date.toISOString().substr(0, 10) + 'T00:00:00.000'
  const e = date.toISOString().substr(0, 10) + 'T23:59:00.000'
  console.log('S', s, 'E', e)
  const result = await db.query(
    `SELECT * FROM v_main_grid
    WHERE subcontractor = $1
    AND date > $2
    AND date < $3`, ['KFC TEST', s, e]
  )
  return result.rows
}
getFirms()
  .then((result) => {
    console.log(result)
  })
