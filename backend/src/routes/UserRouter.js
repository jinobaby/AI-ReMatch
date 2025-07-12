var router = require('express').Router()
var UserSchema = require('../models/UserSchema')
var crypto = require('crypto-js')
var JWT = require('jsonwebtoken')

//user signup router
router.post('/Signup', async (req, res) => {
    try {

        var checkEmail = await UserSchema.findOne({ email: req.body.email })
        if (checkEmail) {
            return res.status(200).json({ message: "User already created account. Please Login to proceed!" })
        } else {


            var password = crypto.AES.encrypt(req.body.password, process.env.pasdword).toString()
            var newUser = new UserSchema({
                password: password,
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone
            })
            await newUser.save()
            res.status(200).json({ success: true, message: "new account created =>" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// User Login
router.post('/login', async (req, res) => {
    console.log(req.body);
    try {
        var findUser = await UserSchema.findOne({ email: req.body.email })
        if (!findUser) {
            return res.status(200).json({ message: "User not found. Please Signup to proceed!" })
        } else {
            var bytes = crypto.AES.decrypt(findUser.password, process.env.pasdword)
            var orginalPassword = bytes.toString(crypto.enc.Utf8)
            if (req.body.password == orginalPassword) {
                var Token = JWT.sign({ id: findUser._id, email: findUser.email }, process.env.SECRET_KEY, { expiresIn: '10d' })
                res.status(200).json({ Token, id: findUser._id })
            } else {
                return res.status(200).json({ message: "Invalid Password" })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

module.exports = router