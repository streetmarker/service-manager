const express = require('express')
const app = express()

const userLogin = require('./api/user/login')
const userDetails = require('./api/user/details')
const customerLogin = require('./api/customer/login')
const customerDetails = require('./api/customer/details')
const addCustomer = require('./api/customer/addCustomer')

const addLocation = require('./api/location/addLocation')
const getLocations = require('./api/location/getLocations')

const findSlot = require('./api/slot/findSlot')
// const autoInsert = require('./api/slot/autoInsert') // uruchamiane przez Node
// const assignSlot = require('./api/slot/assignSlot')

const getFirmSlots = require('./api/subContractors/getFirmSlots')
const getFirms = require('./api/subContractors/getFirms')
const addFirm = require('./api/subContractors/addFirm')
const getServiceman = require('./api/subContractors/getServiceman')
const addServiceman = require('./api/subContractors/addServiceman')

const getTypeDict = require('./api/fault/getTypeDict')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('server work')
})
app.use('/userLogin', userLogin)
app.use('/userDetails', userDetails)
app.use('/customerLogin', customerLogin)
app.use('/customerDetails', customerDetails)
app.use('/addCustomer', addCustomer)

app.use('/addLocation', addLocation)
app.use('/getLocations', getLocations)

app.use('/findSlot', findSlot)
// app.use('/autoInsert', autoInsert)
// app.use('/assignSlot', assignSlot)

app.use('/getFirmSlots', getFirmSlots)
app.use('/getFirms', getFirms)
app.use('/addFirm', addFirm)
app.use('/getServiceman', getServiceman)
app.use('/addServiceman', addServiceman)

app.use('/getTypeDict', getTypeDict)

export default {
  path: '/api',
  handler: app
}
