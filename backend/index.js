require('dotenv').config();
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const userRoute= require("./routes/userRoute")
const offerRoute = require("./routes/offerRoute")
const connectDb = require("./connections/connnection")

//importing user an ooferSchema
const User= require("./models/UserModel")
const Offer= require("./models/OfferModel")


app.use(cors())   
                   // ✅ invoke cors

app.use(bodyParser.json())           // ✅ parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })) // ✅ parse form data
connectDb()
app.get("/", (req, res) => {
    res.send("this is the main server")
})

app.listen(8080, () => {
    console.log("Server running on port 8080")
})
// user
app.use("/user",userRoute)
//for offer. 
app.use("/offer",offerRoute)