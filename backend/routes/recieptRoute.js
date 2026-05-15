const express= require("express")

const recieptRoute= express.Router()

const serviceAccount = require("../../backend/serviceEmail")
const {google}= require("googleapis")
const dotenv= require("dotenv")
const { getReciept, addReciept, editReciept, deleteReciept } = require("../controllers/registerController")

dotenv.config()

//link: domain/reciept/
recieptRoute.get("/", getReciept);
//link: domain/reciept/

recieptRoute.post("/", addReciept);
//link: domain/reciept/:id
recieptRoute.put("/:id", editReciept);
//link: domain/reciept/:id
recieptRoute.delete("/:id", deleteReciept);


module.exports=recieptRoute
