const express= require("express")
const authMiddleWare = require("../middleware/authMiddleware")
const  {userSignup, userLogin}  = require("../controllers/userController")
const userRoute= express.Router()
//domain/user/siginup
userRoute.post("/signup",userSignup)
//domain/user/login
userRoute.post('/login',userLogin)

userRoute.post("/logout",authMiddleWare,(req,res)=>{
    // Invalidate the token on the client side by clearing it from storage

    res.status(200).send("Logged out successfully");
})




module.exports=userRoute