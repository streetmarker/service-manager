const express = require('express')
const app = express()

const login = require('./api/user/login')
const details = require('./api/user/details')

const addLocation = require('./api/location/addLocation')
const getLocations = require('./api/location/getLocations')

const getFirmSlots = require('./api/subContractors/getFirmSlots')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('server work')
})
app.use('/login', login)
app.use('/details', details)

app.use('/addLocation', addLocation)
app.use('/getLocations', getLocations)

app.use('/getFirmSlots', getFirmSlots)

export default {
  path: '/api',
  handler: app
}
