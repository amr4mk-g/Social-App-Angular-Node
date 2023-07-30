const express = require('express')
const control = require('../controllers/user')
const router = express.Router()

router.post('/signup', control.signup)
router.post('/login', control.login)

module.exports = router