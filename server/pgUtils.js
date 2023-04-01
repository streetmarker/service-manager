import { Pool } from 'pg'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.NUXT_ENV_PG_PASSWORD,
  port: 5432
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
