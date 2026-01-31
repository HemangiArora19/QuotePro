const express= require("express")
const authMiddleWare = require("../middleware/authMiddleware")
const  {userSignup, userLogin}  = require("../controllers/userController")
const userRoute= express.Router()
//domain/user/siginup
userRoute.post("/signup",userSignup)
//domain/user/login
userRoute.post('/login',userLogin)





module.exports=userRoute