// const express= require("express")

// const paymentRoute = express.Router() 

// const {google}= require('googleapis')

// const auth= new google.auth.GoogleAuth({
//     keyFile:'./google.json',
//     scopes:['https://www.googleapis.com/auth/spreadsheets'],

// })

// async function writeToSheet(values){
//     const sheets= google.sheets({version:'v4',auth});
//     const spreadsheetId='1TP_dE90C_fmRHttuNlD8zQF2iK9cQ2giAIK-nMyUnoM';
//     const range='Sheet1!A1';
//     const valueInputOption='USER_ENTERED';

//     const resource={values};

//     try{
//          const res=await sheets.spreadsheets.values.update({
//             spreadsheetId,range,valueInputOption,resource
//         })
//         return res;

//     }catch(error){
//        console.error('error',error);
//     }
// }





// async function readSheet() {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = '1TP_dE90C_fmRHttuNlD8zQF2iK9cQ2giAIK-nMyUnoM';
//   const range = 'Sheet1!A1:E10';

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range
//     });

//     const rows = response.data.values;
//     return rows;
//   } catch (error) {
//     console.error('error', error);
//   }
// }





// (async () => {
//   const writer = await writeToSheet([
//     ['Name', 'Age', 'Location'],
//     ['Ado', 33, 'Miami'],
//     ['Pepe', 21, 'Singapore'],
//     ['Juan', 32, 'Mexico']
//   ]);
  
//   console.log(writer);

//   const reader= await readSheet()
//   console.log(reader)
// })();

// module.exports=paymentRoute


// const express = require("express");
// const paymentRoute = express.Router();

// const { google } = require("googleapis");
// const path = require("path");

// const auth = new google.auth.GoogleAuth({
//   keyFile:'./google.json',
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const spreadsheetId = "1TP_dE90C_fmRHttuNlD8zQF2iK9cQ2giAIK-nMyUnoM";

// function getSheets() {
//   return google.sheets({ version: "v4", auth });
// }

// /* -------- ENSURE HEADER EXISTS -------- */
// async function ensureHeader() {
//   const sheets = getSheets();

//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Sheet1!A1:G1",
//   });

//   if (!res.data.values) {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: "Sheet1!A1:G1",
//       valueInputOption: "USER_ENTERED",
//       resource: {
//         values: [["ID", "S.no", "Date", "Cheque", "Amount", "Customer", "Bank","modeOfPayment","status"]],
//       },
//     });
//   }
// }

// /* ---------------- READ ---------------- */
// paymentRoute.get("/", async (req, res) => {
//   try {
//     await ensureHeader();
//     const sheets = getSheets();

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: "Sheet1!A:G",
//     });

//     res.json(response.data.values || []);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------- ADD ---------------- */
// paymentRoute.post("/add", async (req, res) => {
//   try {
//     await ensureHeader();
//     const sheets = getSheets();

//     const { date, cheque, amount, customer, bank ,modeOfPayment,status} = req.body;

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: "Sheet1!A:H",
//     });

//     const rows = response.data.values || [];

//     // 1. Convert existing rows → JSON
//     const existingData = rows.slice(1).map(row => ({
//       date: row[2],
//       cheque: row[3],
//       amount: row[4],
//       customer: row[5],
//       bank: row[6],
//       modeOfPayment:row[7],
//       status:row[8]
//     }));

//     // 2. New item
//     const newItem = {
//       date,
//       cheque,
//       amount,
//       customer,
//       bank,
//       modeOfPayment,
//       status,
//     };

//     // 3. Normalize helper
//     const normalize = (val) => (val ?? "").toString().trim().toLowerCase();

//     // 4. Duplicate check (cheque + customer + date)
//     const isDuplicate = existingData.some(item =>
//       newItem.cheque &&

//       normalize(item.cheque) === normalize(newItem.cheque) &&
//       normalize(item.customer) === normalize(newItem.customer) &&
//       normalize(item.date) === normalize(newItem.date) && (normalize(item.modeOfPayment)===normalize(newItem.modeOfPayment)) && normalize(item.status)===normalize(newItem.status)
//     );

//     if (isDuplicate) {
//       return res.status(400).json({
//         message: "Duplicate entry not allowed",
//       });
//     }

//     // 5. Insert new record
//     const serial = rows.length; // S.NO
//     const id = "PAY" + Date.now();

//     const values = [[
//       id,
//       serial,
//       newItem.date,
//       newItem.cheque || "",
//       newItem.amount,
//       newItem.customer,
//       newItem.bank,
//       newItem.modeOfPayment,
//       newItem.status
//     ]];

//     await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: "Sheet1!A:Z",
//       valueInputOption: "USER_ENTERED",
//       resource: { values },
//     });

//     res.json({
//       message: "Added successfully",
//       id,
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });
// /* ---------------- UPDATE ---------------- */
// paymentRoute.put("/update/:id", async (req, res) => {
//   try {
//     await ensureHeader();
//     const sheets = getSheets();

//     const id = req.params.id;
//     const { date, cheque, amount, customer, bank,modeOfPayment,status } = req.body;

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: "Sheet1!A:G",
//     });

//     const rows = response.data.values;

//     let rowIndex = -1;

//     for (let i = 1; i < rows.length; i++) {
//       if (rows[i][0] == id) {
//         rowIndex = i + 1;
//         break;
//       }
//     }

//     if (rowIndex === -1) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     const sno = rows[rowIndex - 1][1];

//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `Sheet1!A${rowIndex}:G${rowIndex}`,
//       valueInputOption: "USER_ENTERED",
//       resource: {
//         values: [[id, sno, date, cheque, amount, customer, bank,modeOfPayment,status]],
//       },
//     });

//     res.json({ message: "Updated" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------- DELETE ---------------- */
// paymentRoute.delete("/delete/:id", async (req, res) => {
//   try {
//     await ensureHeader();
//     const sheets = getSheets();

//     const id = req.params.id;

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: "Sheet1!A:G",
//     });

//     const rows = response.data.values;

//     let rowIndex = -1;

//     for (let i = 1; i < rows.length; i++) {
//       if (rows[i][0] == id) {
//         rowIndex = i;
//         break;
//       }
//     }

//     if (rowIndex === -1) {
//       return res.status(404).json({ message: "Not found" });
//     }

//     // DELETE ROW (shift up)
//     await sheets.spreadsheets.batchUpdate({
//       spreadsheetId,
//       resource: {
//         requests: [
//           {
//             deleteDimension: {
//               range: {
//                 sheetId: 0,
//                 dimension: "ROWS",
//                 startIndex: rowIndex,
//                 endIndex: rowIndex + 1,
//               },
//             },
//           },
//         ],
//       },
//     });

//     // RESET S.no
//     await resetSerialNumbers();

//     res.json({ message: "Deleted" });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* -------- RESET S.NO -------- */
// async function resetSerialNumbers() {
//   const sheets = getSheets();

//   const res = await sheets.spreadsheets.values.get({
//     spreadsheetId,
//     range: "Sheet1!A:G",
//   });

//   const rows = res.data.values;

//   for (let i = 1; i < rows.length; i++) {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `Sheet1!B${i + 1}`,
//       valueInputOption: "USER_ENTERED",
//       resource: {
//         values: [[i]],
//       },
//     });
//   }
// }

// module.exports = paymentRoute;





const express = require("express");
const paymentRoute = express.Router();

const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./google.example.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1TP_dE90C_fmRHttuNlD8zQF2iK9cQ2giAIK-nMyUnoM";

function getSheets() {
  return google.sheets({ version: "v4", auth });
}

/* -------- ENSURE HEADER -------- */
async function ensureHeader() {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A1:I1",
  });

  if (!res.data.values || res.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1:I1",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[
          "ID",
          "S.no",
          "Date",
          "Cheque",
          "Amount",
          "Customer",
          "Bank",
          "modeOfPayment",
          "status"
        ]],
      },
    });
  }
}

/* ---------------- READ ---------------- */
paymentRoute.get("/", async (req, res) => {
  try {
    await ensureHeader();
    const sheets = getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    res.json(response.data.values || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- ADD ---------------- */
paymentRoute.post("/add", async (req, res) => {
  try {
    await ensureHeader();
    const sheets = getSheets();

    const { date, cheque, amount, customer, bank, modeOfPayment, status } = req.body;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    const rows = response.data.values || [];

    const normalize = (val) => (val ?? "").toString().trim().toLowerCase();

    const isDuplicate = rows.slice(1).some(row =>
      normalize(row[3]) === normalize(cheque) &&
      normalize(row[5]) === normalize(customer) &&
      normalize(row[2]) === normalize(date)
    );

    if (isDuplicate) {
      return res.status(400).json({
        message: "Duplicate entry not allowed",
      });
    }

    const serial = rows.length || 1;
    const id = "PAY" + Date.now();

    const values = [[
      id,
      serial,
      date,
      cheque || "",
      amount,
      customer,
      bank,
      modeOfPayment,
      status
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    res.json({ message: "Added successfully", id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- UPDATE ---------------- */
paymentRoute.put("/update/:id", async (req, res) => {
  try {
    await ensureHeader();
    const sheets = getSheets();

    const id = req.params.id;
    const { date, cheque, amount, customer, bank, modeOfPayment, status } = req.body;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    const rows = response.data.values;

    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] == id) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    const sno = rows[rowIndex - 1][1];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${rowIndex}:I${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[
          id,
          sno,
          date,
          cheque,
          amount,
          customer,
          bank,
          modeOfPayment,
          status
        ]],
      },
    });

    res.json({ message: "Updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE ---------------- */
paymentRoute.delete("/delete/:id", async (req, res) => {
  try {
    await ensureHeader();
    const sheets = getSheets();

    const id = req.params.id;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    const rows = response.data.values;

    let rowIndex = -1;

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] == id) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Not found" });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    await resetSerialNumbers();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- RESET S.NO (OPTIMIZED) -------- */
async function resetSerialNumbers() {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:I",
  });

  const rows = res.data.values;

  const updatedSno = rows.slice(1).map((_, i) => [i + 1]);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!B2:B${rows.length}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: updatedSno,
    },
  });
}

module.exports = paymentRoute;