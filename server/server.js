const express = require('express')

const app = express()

const userLogin = require('./api/user/login')
const userDetails = require('./api/user/details')
const getRoleDict = require('./api/user/getRoleDict')

const customerLogin = require('./api/customer/login')
const customerDetails = require('./api/customer/details')
const addCustomer = require('./api/customer/addCustomer')
const getCustomers = require('./api/customer/getCustomers')

const addLocation = require('./api/location/addLocation')
const getLocations = require('./api/location/getLocations')
const searchLocation = require('./api/location/searchLocation')

const findSlot = require('./api/slot/findSlot')
const autoInsertNew = require('./api/slot/autoInsertNew')

const getFirmSlots = require('./api/subContractors/getFirmSlots')
const getFirms = require('./api/subContractors/getFirms')
const addFirm = require('./api/subContractors/addFirm')
const getServiceman = require('./api/subContractors/getServiceman')
const addServiceman = require('./api/subContractors/addServiceman')

const getTypeDict = require('./api/fault/getTypeDict')
const getSlotHour = require('./api/fault/getSlotHour')
const getFaultStatus = require('./api/fault/getFaultStatus')
const updateFaultStatus = require('./api/fault/updateFaultStatus')
const createFault = require('./api/fault/createFault')
const getFaults = require('./api/fault/getFaults')
const getFault = require('./api/fault/getFault')
const insertComment = require('./api/fault/insertComment')
const getComments = require('./api/fault/getComments')

const getAssignedFaults = require('./api/serviceman/getAssignedFaults')
const removeServiceman = require('./api/serviceman/removeServiceman')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('server work')
})
app.use('/userLogin', userLogin)
app.use('/userDetails', userDetails)
app.use('/getRoleDict', getRoleDict)

app.use('/customerLogin', customerLogin)
app.use('/customerDetails', customerDetails)
app.use('/addCustomer', addCustomer)
app.use('/getCustomers', getCustomers)

app.use('/addLocation', addLocation)
app.use('/getLocations', getLocations)
app.use('/searchLocation', searchLocation)

app.use('/findSlot', findSlot)
app.use('/autoInsertNew', autoInsertNew)

app.use('/getFirmSlots', getFirmSlots)
app.use('/getFirms', getFirms)
app.use('/addFirm', addFirm)
app.use('/getServiceman', getServiceman)
app.use('/addServiceman', addServiceman)

app.use('/getTypeDict', getTypeDict)
app.use('/getSlotHour', getSlotHour)
app.use('/getFaultStatus', getFaultStatus)
app.use('/updateFaultStatus', updateFaultStatus)
app.use('/createFault', createFault)
app.use('/getFaults', getFaults)
app.use('/getFault', getFault)
app.use('/insertComment', insertComment)
app.use('/getComments', getComments)

app.use('/getAssignedFaults', getAssignedFaults)
app.use('/removeServiceman', removeServiceman)

export default {
  path: '/api',
  handler: app
}
