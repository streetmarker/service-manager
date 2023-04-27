const express = require('express')
const app = express()

const userLogin = require('./api/user/login')
const userDetails = require('./api/user/details')
const customerLogin = require('./api/customer/login')
const customerDetails = require('./api/customer/details')
const addCustomer = require('./api/customer/addCustomer')
const getCustomers = require('./api/customer/getCustomers')

const addLocation = require('./api/location/addLocation')
const getLocations = require('./api/location/getLocations')

const findSlot = require('./api/slot/findSlot')
const autoInsertNew = require('./api/slot/autoInsertNew')
// const autoInsert = require('./api/slot/autoInsert') // uruchamiane przez Node
// const assignSlot = require('./api/slot/assignSlot') // not used??

const getFirmSlots = require('./api/subContractors/getFirmSlots')
const getFirms = require('./api/subContractors/getFirms')
const addFirm = require('./api/subContractors/addFirm')
const getServiceman = require('./api/subContractors/getServiceman')
const addServiceman = require('./api/subContractors/addServiceman')

const getTypeDict = require('./api/fault/getTypeDict')
const getSlotHour = require('./api/fault/getSlotHour')
const getFaultStatus = require('./api/fault/getFaultStatus')
const createFault = require('./api/fault/createFault')
const getFaults = require('./api/fault/getFaults')

const getAssignedFaults = require('./api/serviceman/getAssignedFaults')
const removeServiceman = require('./api/serviceman/removeServiceman')

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
app.use('/getCustomers', getCustomers)

app.use('/addLocation', addLocation)
app.use('/getLocations', getLocations)

app.use('/findSlot', findSlot)
app.use('/autoInsertNew', autoInsertNew)
// app.use('/autoInsert', autoInsert)
// app.use('/assignSlot', assignSlot)

app.use('/getFirmSlots', getFirmSlots)
app.use('/getFirms', getFirms)
app.use('/addFirm', addFirm)
app.use('/getServiceman', getServiceman)
app.use('/addServiceman', addServiceman)

app.use('/getTypeDict', getTypeDict)
app.use('/getSlotHour', getSlotHour)
app.use('/getFaultStatus', getFaultStatus)
app.use('/createFault', createFault)
app.use('/getFaults', getFaults)

app.use('/getAssignedFaults', getAssignedFaults)
app.use('/removeServiceman', removeServiceman)

export default {
  path: '/api',
  handler: app
}
