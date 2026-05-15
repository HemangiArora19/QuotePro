const express = require("express");
const paymentRoute = express.Router();
const serviceAccount = require("../../backend/serviceEmail")
const { google } = require("googleapis");
const dotenv= require("dotenv");

dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
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
  console.log(serviceAccount)
  try {
    await ensureHeader();
    const sheets = getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:I",
    });

    res.json(response.data.values || []);
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err });
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