
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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
const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        const isExists =await User.findOne({email})
        if(!isExists){
            return res.status(404).json({
                message:"User Not exists"
            })
        }

        const isPassword = await bcrypt.compare(password,isExists.password)
        if(!isPassword){
            return res.status(401).json({
                message:"Password wrong"
            })
        }

        const accessToken = jwt.sign({
            id:isExists._id,
            role:isExists.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )

    const refreshToken = jwt.sign({
        id:isExists._id,
        role:isExists.role
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:"7d"}
)
    res.status(200).json({
        success:true,
        accessToken,
        refreshToken,
        user:{
            name:isExists.name,
            _id:isExists._id,
            email:isExists.email,
            role:isExists.role
        }

    })


    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }


}
module.exports = {registerUser,loginUser}