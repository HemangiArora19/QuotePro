const express= require("express")
const authMiddleWare = require("../middleware/authMiddleware")
const { createOffer, getOffersByUser, editOffer, getOfferById } = require("../controllers/offerController")
const offerRoute= express.Router()
//route: domain/quote/create
offerRoute.post("/create",authMiddleWare,createOffer)
//route:domain/offer/get/:userId
offerRoute.get("/get/:userId",authMiddleWare,getOffersByUser)
// route:domain/offer/edit
offerRoute.post("/editById/:id",authMiddleWare,editOffer)
//route:domain/offer/getById/:offerId
offerRoute.get("/getById/:offerId",authMiddleWare,getOfferById)

module.exports= offerRoute