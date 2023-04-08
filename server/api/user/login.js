const express = require('express')
const jwt = require('jsonwebtoken')
const db = require('../../pgUtils')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('login here :)')
})

router.post('/', (req, res) => {
  const { login, password } = req.body
  db.query(
    'SELECT * FROM users WHERE login = $1 AND password = $2',
    [login, password],
    (error, results) => {
      if (error) {
        throw error
      }

      if (results.rows.length === 0) {
        res.status(401).json('Invalid login or password')
      } else {
        const token = jwt.sign(
          { login, password },
          process.env.NUXT_ENV_API_SECRET
        )
        res.status(200).json({ token })
        // res.status(200).json({ message: 'Logged in' });
      }
    }
  )
})

module.exports = router
