const express= require("express")
const authMiddleWare= require('../middleware/authMiddleware')
const { createInvoice, getInvoice, getInvoiceById, editInvoiceById, deleteInvoiceById } = require("../controllers/invoiceController")
const invoiceRoute= express.Router()

//domain/invoice/create
invoiceRoute.post("/create",authMiddleWare,createInvoice)
//domain/invoice/get
invoiceRoute.get("/get",authMiddleWare,getInvoice)
//domain/invoic/getById/:id
invoiceRoute.get("/getById/:id",authMiddleWare,getInvoiceById)
//domain/invoice/editById/:id
invoiceRoute.post("/editById/:id",authMiddleWare,editInvoiceById)
//domain/invoice/deleteById/:id
invoiceRoute.delete("/deleteById/:id",authMiddleWare,deleteInvoiceById)

module.exports=invoiceRoute