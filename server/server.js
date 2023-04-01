const express = require('express')
const app = express()

const login = require('./api/user/login')
const details = require('./api/user/details')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('server work')
})
app.use('/login', login)
app.use('/details', details)

export default {
  path: '/api',
  handler: app
}
