const mongoose = require('mongoose')

const schema = mongoose.Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('User', schema)