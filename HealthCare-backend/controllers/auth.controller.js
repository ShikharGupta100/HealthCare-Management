
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")


const registerUser = async(req,res)=>{
    try{
        const {email,password,name,role} = req.body
        const isExists = await User.findOne({email})
        if(isExists){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)


        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            role
        })

        res.status(201).json({
            success:true,
            message:"User registerd successfully",
            user:{
                _id:newUser._id,
                email:newUser.email,
                role:newUser.role,
                name:newUser.name
            }

        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
        
    }

}
module.exports = {registerUser}