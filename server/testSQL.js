const db = require('./pgUtils')

async function getFirms () {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  console.log(date)
  const s = date.toISOString().substr(0, 10) + 'T00:00:00.000'
  const e = date.toISOString().substr(0, 10) + 'T23:59:00.000'
  console.log('S', s, 'E', e)
  // const arr =[3, 4]
  const result = await db.query(
    `SELECT * FROM users
    WHERE login = $1 AND "password" = $2`, ['admin', 'admin1'])
  return result.rows
}
getFirms()
  .then((result) => {
    console.log(result)
    // const days = []
    // const year = new Date().getFullYear()
    // const day = new Date().getMonth() + 1
    // const today = new Date(year, day, 0).getDate()
    // for (let i = 1; i < 31; i++) {
    //   if ((today + i + 1) !== 1) {
    //     days.push(today + i)
    //     today++
    //   } else {
    //     return
    //   }
    // }
    // result[0].reserved.push(3)
    // console.log(today)
    // console.log(day, year)
  })
// `SELECT reserved FROM TimeSlot t
// WHERE t.id = $1`, [69]
//     'UPDATE TimeSlot t SET reserved = ARRAY[1] WHERE id = 69'

// `SELECT * FROM fault f
// LEFT JOIN timeslot t ON t.id = f.timeslot_id
// limit 1`

// `CREATE OR REPLACE VIEW user_details AS
//     SELECT u.login, u.email, r.id AS roleId, r.name AS roleName, r.is_admin AS isAdmin FROM Users u
//     LEFT JOIN Roles r ON u.Role_ID = r.ID;`
