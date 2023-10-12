const { createLogger, format } = require('winston')
const winston = require('winston')
const { combine, timestamp, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = createLogger({
  // level: 'info', // Poziom logowania
  //   format: winston.format.json(), // Format logów
  format: combine(
    // label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  //   transports: [new transports.Console()]
  transports: [
    new winston.transports.File({ filename: 'service-manager-out.log' }) // Zapis do pliku .log
  ]
})

module.exports = logger
