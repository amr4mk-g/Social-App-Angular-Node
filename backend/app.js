const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const postsRouter = require('./routes/postsRoute')
const usersRouter = require('./routes/userRoute')

const app = express()
app.use(express.json())
app.use('/images', express.static(path.join('backend/images')))

mongoose.connect('mongodb://localhost:27017/social-app')
    .then(()=> {}, ()=> console.log('db not connected'))

app.use(cors())
app.use('/api/posts', postsRouter)
app.use('/api/user', usersRouter)

let port = 3000
app.listen(port, ()=> console.log("Listening on " + port));

// to run in terminal:
//   node backend/app.js
//   ng serve