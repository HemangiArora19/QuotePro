const mongoose= require("mongoose")
//name,email,letterpad,password,address,cName,cPhone,

const userSchema= new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        letterpad:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        cName:{
            type:String,
            required:true
        },
        cPhone:{
            type:String,
            require:true
        },
        bankName:{
            type:String,
            required:true
        },
       
        gstNo:{
            type:String,
            required:true   
        },
        accNo:{
            type:String,
            required:true
        },
        ifscCode:{
            type:String,
            required:true
        },
        accName:{
            type:String,
            required:true
        },
        branch:{
            type:String,
            required:true
         }
        


    }
)
module.exports= mongoose.model("User",userSchema)