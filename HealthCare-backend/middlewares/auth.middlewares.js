const jwt = require("jsonwebtoken")


const auth = async(req,res, next)=>{

    try{
        const token =  req.headers.authorization?.split(" ")[1]
         console.log("TOKEN:", token)                          // ← add this
        console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET)

        if(!token){
            return res.status(401).json({
                message:"Unauthorized access token is missing"
            })
        }
        

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()



    }catch(err){
         console.log("JWT ERROR:", err.message) 
        return res.status(401).json({
            message:"Unauthorized access, token is invalid"
        })
    }
}
module.exports = auth