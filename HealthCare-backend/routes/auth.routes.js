const express=require("express")
const router=express.Router()
const {registerUser,loginUser} = require("../controllers/auth.controller")
const auth = require("../middlewares/auth.middlewares")
const roleMiddleware=require("../middlewares/role.middlewares")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",auth,(req,res)=>{
    return res.json({
        success:true,
        user:req.user
    })
})

module.exports = router