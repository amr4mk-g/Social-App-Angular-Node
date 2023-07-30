const multer = require('multer')

let type = {'image/png':'png', 'image/jpeg':'jpg', 'image/jpg':'jpg'}
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        let err = null
        if (!type[file.mimetype]) err = new Error('Invalid image type')
        cb(err, 'backend/images') 
    },
    filename: (req, file, cb) => { 
        let name = file.originalname.toLowerCase().split(' ').join('-')
        cb(null, name+'-'+Date.now()+'.'+type[file.mimetype]) 
    },
})

module.exports = multer({storage}).single('image')