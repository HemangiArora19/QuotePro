const Offer= require("../models/OfferModel");

// const createOffer=async(req,res)=>{
//     const {clientName,clientEmail,clientAddress,quoteNumber,quoteDate,kindAttention,subject,items,subtotal,taxRate,taxAmount,notes}= req.body
//     const createdBy= req.user.id; //from auth middleware
//     try{
//         if(!clientName||!clientEmail||!clientAddress||!quoteNumber||!quoteDate||!items||!subtotal){
//             return res.status(400).send("Pls enter all the details")

//         }
//         //check quoteNumber is there in db
//         const existingOffer= await Offer.findOne({quoteNumber})
//         if(existingOffer){
//             return res.status(400).send("Offer with this quote number already exist")
//         }
//         //create new offer
//         const newOffer= await Offer.create({
//             clientName,
//             clientEmail,
//             clientAddress,
//             quoteNumber,
//             quoteDate,
//             kindAttention,
//             subject,
//             items,
//             subtotal,
//             taxRate,
//             taxAmount,
//             notes,
//             createdBy
//         })
//         res.status(201).send({
//             message:"Offer created successfully",
//             data:newOffer
//         })
//     }catch(err){
//         res.status(500).send("Error creating offer",err)
//     }
// }

const createOffer = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientAddress,
      quoteNumber,
      quoteDate,
      kindAttention,
      subject,
      items,
      subtotal,
      taxRate,
      taxAmount,
      notes
    } = req.body;

    const createdBy = req.user?.id;

    // Basic validation
    if (
      !clientName ||
      !clientEmail ||
      !clientAddress ||
      !quoteNumber ||
      !quoteDate ||
      !Array.isArray(items) || items.length === 0 ||
      subtotal === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Check duplicate quotation number
    const existingOffer = await Offer.findOne({ quoteNumber });
    if (existingOffer) {
      return res.status(400).json({
        message: "Offer with this quote number already exists"
      });
    }

    // Create offer
    const newOffer = await Offer.create({
      clientName,
      clientEmail,
      clientAddress,
      quoteNumber,
      quoteDate,
      kindAttention,
      subject,
      items,
      subtotal,
      taxRate: taxRate || 0,
      taxAmount: taxAmount || 0,
      notes,
      createdBy
    });

    return res.status(201).json({
      message: "Offer created successfully",
      data: newOffer
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error creating offer",
      error: err.message
    });
  }
};

//route:domain/offer/get/:userId
const getOffersByUser=async(req,res)=>{
const userId= req.params.userId;
try{
    const findOffers= await Offer.find({createdBy:userId})
    res.status(200).send({
        message:"Offers fetched successfully",
        offers:findOffers
    })
}catch(err){
res.status(500).send("Error fetching the records")
}}
// route:domain/offer/edit/:offerId
const editOffer=async(req,res)=>{
    const offerId= req.params.id
    try{
    //get all the detaisn from the body
    const {clientName,clientEmail,clientAddress,quoteDate,quoteNumber,kindAttention,subject,items,subtotal,taxRate,taxAmount,notes}=req.body;
    // validate the data
    if(!clientEmail||!clientName||!clientAddress||!quoteDate||!quoteNumber||!items||!subtotal||!kindAttention||!subject){
        return res.status(400).send("Pls enter all the details")
    }
    //id ofFERIs is not there
    const existOffer= await Offer.findById(offerId)
    if(!existOffer){
        return res.status(404).send("Offer not found")
    }
    // find the offerBy id and upadte the offer
    const editOffer= await Offer.findByIdAndUpdate(offerId,{
        clientEmail,
        clientName,
        clientAddress,
        quoteDate,
        quoteNumber,
        kindAttention,
        subject,
        items,
        subtotal,
        taxRate,
        taxAmount,
        notes
    }, { new: true, runValidators: true })
    if(!editOffer){
        return res.status(500).sed("Error in updating the offer, pls try agin after some time")
    }

    res.status(200).send({
        message:"Offer updated successfully",
        offer:editOffer
    })
    }catch(err){
        res.status(500).send("Error updating the offer")
    }

}
//route:domain/offer/getById/:offerId
const getOfferById=async(req,res)=>{
    const offerId= req.params.offerId
    try{
        const offerFind= await Offer.findById(offerId)
        if(!offerFind){
            return res.status(404).send("Offer not found")
        }
       res.status(200).send({
        message:"Offer fetched Suceesfully",
        offerFind
       })
    }catch(err){
        res.status(500).send("Error fetching the offer")
    }
}       

const deleteOfferById= async(req,res)=>{
    const offerId= req.params.offerId;
    try{
        await Offer.findByIdAndDelete(offerId);
        res.status(200).send("Offer deleted successfully")
    }catch(err){
        res.status(500).send("Error deleting the offer")
    }
}
//domain/offer/pdf




const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core");

const generateOfferPdf = async (req, res) => {
  try {
    const { html, fileName } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML is required" });
    }

    const isProduction = !!process.env.VERCEL;

    let executablePath;

    if (isProduction) {
      // Vercel environment
      executablePath = await chromium.executablePath();
    } else {
      // Local environment
      const puppeteer = require("puppeteer");
      executablePath = puppeteer.executablePath();
    }

    const browser = await puppeteerCore.launch({
      args: isProduction ? chromium.args : [],
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName || "offer.pdf"}"`,
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
};




module.exports={createOffer,getOffersByUser,editOffer,getOfferById,deleteOfferById,generateOfferPdf}

