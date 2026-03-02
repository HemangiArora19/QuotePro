// prameter will be 
/*{


prduct dta-> ref prduct,
subtaotal,taxRATE,
ID,
USEID-> RED USER
CRETEDaT DT
CLEINT ADD
COMPANY ADD
BILL NO.
DISPACH THROGHT
FRIGHT ON GTHE ITEM IN PERCENTAGE








}*/
const Invoice= require("../models/InvoiceModel")
//domain/invoice/create
const createInvoice=async(req,res)=>{
    //data from the form
    
   const {inv_num,inv_date,orderRef, dispatchVia,destination,buy_name,buy_address,buy_gstno,items,totals,status}=req.body;
   if(!inv_num || !inv_date || !destination || !buy_name || !buy_address || !buy_gstno || !items || !totals || !status){
    return res.status(400).json({message:"All fields are required"})
   }
   //valiadtion are done
   try{
    const createdByUser= req.user.id;
    //check for existing invoice
    const existingInvoice=await Invoice.findOne({inv_num})
    if(existingInvoice){
        return res.status(400).json({message:"Invoice with this number already exists"})
    }
    const invoice= await Invoice.create({
        inv_num,
        inv_date,
        orderRef,
        dispatchVia,
        destination,
        buy_name,
        buy_address,
        buy_gstno,
        items,
        totals,
        createdBy: createdByUser,
        status
    })  
    if(!invoice){
        return res.status(400).json({message:"Failed to create invoice"})
    }
    res.status(201).json({
        message:"Invoice created successfully",
        invoice:invoice
    })

   }catch(err){
    res.status(500).json({message:"Server error",error:err.message})
   }
}

//domain/invoice/get
const getInvoice=async(req,res)=>{
// to get invioce
const id=req.user.id
try{
 const invoices= await Invoice.find({createdBy:id})
 if(!invoices){
    return res.status(404).json({message:"No invoices found"})
 }
 res.status(200).json({message:"Invoices fetched successfully",invoice:invoices})
}catch(err){
  res.status(500).json({message:"Server error",error:err.message})
}
}
//domain/invoic/getById/:id
const getInvoiceById= async(req,res)=>{
const id=req.params.id
try{
  const invoice=await Invoice.findById(id)
  if(!invoice){
    return res.status(404).json({message:"Invoice not found"})
  }
  res.status(200).json({
    message:"Invoice fetched successfully",
    invoice:invoice
  })
}catch(err){
    res.status(500).json({message:"Server error",error:err.message})
}
}
//domain/invoice/editById/:id
const editInvoiceById = async (req, res) => {
  const { id } = req.params;
  const {
    inv_num,
    inv_date,
    orderRef,
    dispatchVia,
    destination,
    buy_name,
    buy_address,
    buy_gstno,
    items,
    totals,
    status
  } = req.body;

  try {
    const findInv = await Invoice.findById(id);
    if (!findInv) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (!inv_num || !inv_date || !destination || !buy_name || !buy_address || !buy_gstno || !items || !totals || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ build update object
    const updateData = {
      inv_date,
      orderRef,
      dispatchVia,
      destination,
      buy_name,
      buy_address,
      buy_gstno,
      items,
      totals,
      status
    };


    const invoice = await Invoice.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
//domain/invoice/deleteById/:id
const deleteInvoiceById=async(req,res)=>{
    const {id}=req.params
    try{
        const invoice= await Invoice.findByIdAndUpdate(id,{isDeleted:true},{new:true})
        if(!invoice){
            return res.status(404).json({message:"Invoice not found"})
        }

    }catch(err){
        res.status(500).json({message:"Server error",error:err.message})
    }
}
module.exports={
    createInvoice,
    getInvoice,
    getInvoiceById,
    editInvoiceById,
    deleteInvoiceById
}