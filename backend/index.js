const env=require('dotenv').config();
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const userRoute= require("./routes/userRoute")
const offerRoute = require("./routes/offerRoute")
const connectDb = require("./connections/connnection")


//importing user an ooferSchema
const User= require("./models/UserModel")
const Offer= require("./models/OfferModel");
const invoiceRoute = require('./routes/invoiceRoute');
const paymentRoute = require('./routes/paymentRoute');
const recieptRoute= require('./routes/recieptRoute')
console.log(env)

app.use(cors())   

app.use(express.json({ limit: "10mb" }));
                   // ✅ invoke cors

app.use(bodyParser.json())           // ✅ parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })) // ✅ parse form data
connectDb()
app.get("/", (req, res) => {
    res.send("this is the main server")
})
app.use("/user",userRoute)
//for offer. 
app.use("/offer",offerRoute)
//for invoice
app.use("/invoice",invoiceRoute)

app.use("/payment",paymentRoute)

app.use('/reciept',recieptRoute)


app.listen(8080, () => {
    console.log("Server running on port 8080")
})

