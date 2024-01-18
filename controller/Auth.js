const { User } = require("../model/User")

exports.createUser = async (req, res) => {
    const user = await User(req.body)
    try{
        const responce = await user.save()
        res.status(200).json({id:responce.id, role: responce.role})
    }catch (err) {
        res.status(400).json(err)
    }
}

exports.loginUser = async (req, res) => {
    try{
        const user = await User.findOne({email:req.body.email}).exec()
        if(!user){
            res.status(401).json({message: "no such user with this email"})   
        }
        else if(user.password === req.body.password){
            res.status(201).json({id: user.id, role: user.role})
        }else{
            res.status(401).json({message: "Invalid credentials"})
        }
        
    }catch (err) {
        res.status(400).json(err)
    }
}