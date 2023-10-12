// utils.js
const path = require('path')
const logger = require('../logger')
function getFileName (filePath) {
  return path.basename(filePath)
}

module.exports = {
  getFileName,
  logger
  // inne funkcje narzędziowe
}
