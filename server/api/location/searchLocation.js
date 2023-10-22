const express = require('express')
const router = express.Router()
const axios = require('axios')

router.post('/', async (req, res) => {
  try {
    const { text } = req.body
    const encodedQuery = encodeURIComponent(text)
    const options = {
      method: 'GET',
      url: `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json`
    }
    const response = await axios.request(options)
    res.send(response.data[0])
  } catch (error) {
    console.error(error)

    // return res.json(error).sendStatus(500);
  }
})

module.exports = router
