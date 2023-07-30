const express = require('express')
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')
const control = require('../controllers/posts')
const router = express.Router()

router.get('', control.home)
router.get('/:id', control.getPost)
router.post('', auth, upload, control.addPost)
router.put('/:id', auth, upload, control.editPost)
router.delete('/:id', auth, control.deletePost)

module.exports = router