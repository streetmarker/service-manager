const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // '130.162.58.161',
  database: 'postgres',
  password: process.env.NUXT_ENV_PG_PASSWORD,
  port: 5432
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
  // end: () => {
  //   pool.end()
  // }
}
