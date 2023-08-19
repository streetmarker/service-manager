const { Pool } = require('pg')
const PGPubsub = require('pg-pubsub')
require('dotenv').config()

const pool = new Pool({
  user: 'postgres',
  host: process.env.NUXT_ENV_PG_HOST, // '130.162.58.161',
  database: 'postgres',
  password: process.env.NUXT_ENV_PG_PASSWORD,
  port: 5432
})
const conString = 'postgres://postgres:' + process.env.NUXT_ENV_PG_PASSWORD + '@' + process.env.NUXT_ENV_PG_HOST + ':5432/postgres'
const subscriber = new PGPubsub(conString)

subscriber.addChannel('channel', function (channelPayload) {
  console.log('channel data', channelPayload)
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
  // connect () {
  //   return pool.connect()
  // },
  // end: () => {
  //   pool.end()
  // }
}
