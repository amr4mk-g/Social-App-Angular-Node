const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

module.exports = {
   signup: async (req, res) =>{
        try {
            let {name, email, password} = req.body
            let user = await User.findOne({email})
            if (user) return res.status(401).json({message: 'Email already registered'})
            let hash = await bcrypt.hash(password, 10)
            new User({name, email, password: hash}).save().then(user => {
                let token = jwt.sign({id:user._id, name:name}, 'secretKey', {expiresIn:'5h'})
                res.status(201).json({token, expire: 5, userId: user._id})
            })
        }catch (err) { 
            res.status(500).json({message: 'An unexpected error'})
        }
    },
    login: async (req, res) =>{
        try {
            let {email, password} = req.body
            let user = await User.findOne({email})
            if (!user) return res.status(401).json({message: 'Email not registered'})
            let match = await bcrypt.compare(password, user.password)
            if (!match) return res.status(401).json({message: 'The password is incorrect'})
            let token = jwt.sign({id:user._id, name: user.name}, 'secretKey', {expiresIn:'5h'})
            res.status(200).json({token, expire: 5, userId:user._id})
        }catch (err) {
            res.status(500).json({message: 'An unexpected error'})
        }
    }
}