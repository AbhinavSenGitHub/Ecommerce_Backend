const { User } = require("../model/User")
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY
exports.createUser = async (req, res) => {
    try {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            const user = await User({ ...req.body, password: hashedPassword, salt })
            const responce = await user.save()
            req.login(sanitizeUser(responce), (err) => {
                if (err) {
                    res.status(400).json(err)
                } else {
                    const token = jwt.sign(sanitizeUser(responce), SECRET_KEY);
                    res.cookie(
                        'jwt', 
                        token, 
                        { expires: new Date(Date.now() + 3600000), 
                          httpOnly: true 
                        }).status(201).json({id:responce.id, role:responce.role})
                }
            })
        })
    } catch (err) {
        res.status(400).json(err)
    }
}

exports.loginUser = async (req, res) => {
    const user = req.user
    res.cookie(
        'jwt', 
        user.token, 
        { expires: new Date(Date.now() + 3600000), 
          httpOnly: true 
        }).status(201).json({id:user.id, role:user.role})
}

exports.checkAuth = async (req, res) => {
    if(req.user){
        res.json(req.user)
    }else{
        res.sendStatus(401)
    }
}

exports.resetPasswordRequest = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email: email})
    if(user) {
        const token = crypto.randomBytes(48).toString('hex')
        user.resetPasswordToken = token
        await user.save()
        
    const resetPageLink = "http://localhost:3000/reset-password?token="+token+"&email="+email
    const subject = "reset password"
    const html = `<p>Click <a href=${resetPageLink}>here</a> to Reset Password</p>`
    if(email){
        const responce = await sendMail({ to: email, subject, html })
        res.json(responce)
    }else{
        res.sendStatus(401)
    }
    }else{
        res.sendStatus(401)
    }
}

exports.resetPassword = async (req, res) => {

    const {email, password, token } = req.body

    const user = await User.findOne({ email: email, resetPasswordToken: token })
    if(user) {
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
            user.password = hashedPassword;
            user.salt = salt;
            await user.save()
            const resetPageLink = "http://localhost:3000/"
            const subject = "password successfully reset"
            const html = `<p>Your password has been successfully reset! <a href=${resetPageLink}>here</a></p>`
            if(email){
                const responce = await sendMail({ to: email, subject, html })
                res.json(responce)
            }else{
                res.sendStatus(401)
            }
        })   
    }else{
        res.sendStatus(401)
    }
}