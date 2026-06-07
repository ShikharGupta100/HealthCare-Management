const jwt = require("jsonwebtoken")


const auth = async(req,res, next)=>{

    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).json({
                message:"Unauthorized access token is missing"
            })
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()



    }catch(err){
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }
}
module.exports = auth