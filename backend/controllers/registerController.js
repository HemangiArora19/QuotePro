// const serviceAccount = require("../../backend/serviceEmail")
// const {google}= require("googleapis")
// const dotenv= require("dotenv")

// dotenv.config()

// const auth = new google.auth.GoogleAuth({
//     credentials: serviceAccount,
//     scopes:["https://www.googleapis.com/auth/spreadsheets"],
// })

// const spreadsheetId = "1UJARsMvpth8VYMxCAQbeBz4yrJAvnBb7Z7UvyvdcHMQ";

// async function getSheets(){
//     return google.sheets({version:"v4",auth});
// }

// async function ensureHeader(){
//     const sheets= getSheets()
//     const res= (await sheets).spreadsheets.values.get({
//         spreadsheetId,
//         range:"Sheet1!A1:I1",
//     })

//     if(!(await res).data.values || (await res).data.values.length===0){
//         (await sheets).spreadsheets.values.update({
//             spreadsheetId,
//             range:"Sheet1!A1:I1",
//             valueInputOption:"USER_ENTERED",
//             resource:{
//                 values:[
//                     [
//                        "S.no",
//                        "ID",
//                        "Current Date",
//                        "Cheque Date",
//                        "Cheque Number",
//                        "Bank",
//                        "Amount",
//                        "Party Name",
//                        "Type of Payment",
//                        "Status"
//                     ]
//                 ]
//             }
//         })
//     }
// }
// const getReciept= async(req,res)=>{
//     console.log(serviceAccount)
//     try{
//         await ensureHeader()
//         const sheets= getSheets()
//         const response= await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range:"Sheet1!A:I",
//         })
   
//         res.json(response.data.values|| [])


    
//     }catch(err){
//         res.status(500).send("Error in the fetchining data",err)
//     }


// }
// const editReciept= async(req,res)=>{
//     try{
//         const id= req.params.id
//         const{currentDate,chequeDate,chequeNumber,bank,amount,partyName,typeOfPayment,status}= req.body
//         await ensureHeader()
//         const sheets= getSheets();
        
//         const response= await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range:"Sheet1!A:I",
//         })
//        const rows= response.data.values ||[]
//        const rowIndex= rows.findIndex(row=>row[1]===id)
//        if(rowIndex===-1){
//         return res.status(404).json({message:"Reciept not found"})
//        }
//        const updatedRow= [rowIndex, id,currentDate,chequeDate,chequeNumber,bank,amount,partyName,typeOfPayment,status]
//        await sheets.spreadsheets.values.update({
//         spreadsheetId,
//         range:`Sheet1!A${rowIndex+1}:I${rowIndex+1}`,
//         valueInputOption:"USER_ENTERED",
//         resource:{
//             values:[updatedRow]
//         }
//        })
//        res.status(200).json({message:"Reciept updated successfully"})

//     }catch(err){
//         res.status(500).send("Error in the upadting data",err)
//     }


// }
// async function resetSerialNumbers() {
//   const sheets = getSheets();

//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Sheet1!A:I",
//   });

//   const rows = res.data.values;

//   const updatedSno = rows.slice(1).map((_, i) => [i + 1]);

//   await sheets.spreadsheets.values.update({
//     spreadsheetId,
//     range: `Sheet1!B2:B${rows.length}`,
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: updatedSno,
//     },
//   });
// }
// const deleteReciept= async(req,res)=>{
//     const id= req.params.id
//     try{
//         await ensureHeader()
//         const sheets= getSheets();      
//         const response= await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range:"Sheet1!A:I",
//         })
//        const rows= response.data.values ||[]
//        const rowIndex= rows.findIndex(row=>row[1]===id)
//        if(rowIndex===-1){
//         return res.status(404).json({message:"Reciept not found"})
//        }
//        await sheets.spreadsheets.values.clear({
//         spreadsheetId,
//         range:`Sheet1!A${rowIndex+1}:I${rowIndex+1}`,
//        })
//        await resetSerialNumbers()
//        res.status(200).json({message:"Reciept deleted successfully"})

//     }catch(err){
//         res.status(500).send("Error in the deleting data",err)
//     }       

// }

// const addReciept= async(req,res)=>{
//     try{
//         const id= "REP"+Date.now().toString()
//         const{currentDate,chequeDate,chequeNumber,bank,amount,partyName,typeOfPayment,status}= req.body
//         await ensureHeader()
//         const sheets= getSheets();
        
//         const response= await sheets.spreadsheets.values.get({
//             spreadsheetId,
//             range:"Sheet1!A:I",
//         })
//        const rows= response.data.values ||[]
//        const nomalize= (val)=>(val??"").toString().trim().toLowerCase()
//       const isDuplicate= rows.some(row=>normalize(row[3])=== nomalize(chequeNumber) && normalize(row[5])=== nomalize(partyName) && normalize(row[2])=== nomalize(currentDate))
//       if(isDuplicate){
//         return res.status(400).json({message:"Duplicate entry found"})
//       }
//          const newRow= [rows.length, id,currentDate,chequeDate,chequeNumber,bank,amount,partyName,typeOfPayment,status]
//          await sheets.spreadsheets.values.append({
//           spreadsheetId,
//           range:"Sheet1!A:I",   
//             valueInputOption:"USER_ENTERED",
//             resource:{
//                 values:[newRow]
//             }
//          })
//          res.status(201).json({message:"Reciept added successfully",id})

//     }catch(err){
//        res.status(500).json({
//   message: "Error in adding data",
//   error: err.message
// });
//     }

// }
// module.exports={
//     getReciept,
//     editReciept,
//     deleteReciept,
//     addReciept,
// }

const serviceAccount = require("../../backend/serviceEmail")
const { google } = require("googleapis")
const dotenv = require("dotenv")

dotenv.config()

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const spreadsheetId = "1UJARsMvpth8VYMxCAQbeBz4yrJAvnBb7Z7UvyvdcHMQ";

async function getSheets() {
    return google.sheets({ version: "v4", auth });
}

async function ensureHeader() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A1:J1",
    });

    if (!res.data.values || res.data.values.length === 0) {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: "Sheet1!A1:J1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[
                    "S.no", "ID", "Current Date", "Cheque Date",
                    "Cheque Number", "Bank", "Amount",
                    "Party Name", "Type of Payment", "Status"
                ]]
            }
        });
    }
}

const getReciept = async (req, res) => {
    try {
        await ensureHeader();
        const sheets = await getSheets();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A:J",
        });
        res.json(response.data.values || []);
    } catch (err) {
        res.status(500).json({ message: "Error in fetching data", error: err.message });
    }
};

const editReciept = async (req, res) => {
    try {
        const id = req.params.id;
        const { currentDate, chequeDate, chequeNumber, bank, amount, partyName, typeOfPayment, status } = req.body;
        await ensureHeader();
        const sheets = await getSheets();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A:J",
        });
        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[1] === id);
        if (rowIndex === -1) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        const updatedRow = [rowIndex, id, currentDate, chequeDate, chequeNumber, bank, amount, partyName, typeOfPayment, status];
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!A${rowIndex + 1}:J${rowIndex + 1}`,
            valueInputOption: "USER_ENTERED",
            resource: { values: [updatedRow] }
        });
        res.status(200).json({ message: "Receipt updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error in updating data", error: err.message });
    }
};

async function resetSerialNumbers() {
    const sheets = await getSheets();
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:J",
    });
    const rows = res.data.values;
    const updatedSno = rows.slice(1).map((_, i) => [i + 1]);
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!A2:A${rows.length}`,  // ✅ Column A, not B
        valueInputOption: "USER_ENTERED",
        resource: { values: updatedSno },
    });
}

const deleteReciept = async (req, res) => {
    const id = req.params.id;
    try {
        await ensureHeader();
        const sheets = await getSheets();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A:J",
        });
        const rows = response.data.values || [];
        const rowIndex = rows.findIndex(row => row[1] === id);
        if (rowIndex === -1) {
            return res.status(404).json({ message: "Receipt not found" });
        }
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: `Sheet1!A${rowIndex + 1}:J${rowIndex + 1}`,
        });
        await resetSerialNumbers();
        res.status(200).json({ message: "Receipt deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error in deleting data", error: err.message });
    }
};

const addReciept = async (req, res) => {
    try {
        const id = "REP" + Date.now().toString();
        const { currentDate, chequeDate, chequeNumber, bank, amount, partyName, typeOfPayment, status } = req.body;
        await ensureHeader();
        const sheets = await getSheets();

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A:J",
        });
        const rows = response.data.values || [];
        const normalize = (val) => (val ?? "").toString().trim().toLowerCase();
        const isDuplicate = rows.some(row =>
            normalize(row[4]) === normalize(chequeNumber) &&  // ✅ index 4
            normalize(row[7]) === normalize(partyName) &&     // ✅ index 7
            normalize(row[2]) === normalize(currentDate)
        );
        if (isDuplicate) {
            return res.status(400).json({ message: "Duplicate entry found" });
        }
        const newRow = [rows.length, id, currentDate, chequeDate, chequeNumber, bank, amount, partyName, typeOfPayment, status];
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A:J",
            valueInputOption: "USER_ENTERED",
            resource: { values: [newRow] }
        });
        res.status(201).json({ message: "Receipt added successfully", id });
    } catch (err) {
        res.status(500).json({ message: "Error in adding data", error: err.message });
    }
};

module.exports = { getReciept, editReciept, deleteReciept, addReciept };