const { createServer } = require('http')
const { Server } = require('socket.io')
const express = require('express')
const cors = require('cors')
const checkSlots = require('./checkNotification')

const app = express()
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

async function check () {
  const res = await checkSlots()
  return res
}

io.on('connection', (socket) => {
  console.log(socket.id)
})

const intervalFunction = async () => {
  try {
    const data = await check()
    console.log('check', 'interval')
    io.emit('new-data', data)
  } catch (error) {
    console.error(error)
  }
}
setInterval(intervalFunction, 10000)

httpServer.listen(3001)
