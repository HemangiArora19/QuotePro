//mde, creation parameter 
//
const mongoose= require("mongoose")
const ItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Item description is required"],
      trim: true,
    },

    hsnCode: {
      type: String,
      required: [true, "HSN/SAC code is required"],
      trim: true,
    },

    qty: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },

    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      default: "NOS",
    },

    rate: {
      type: Number,
      required: [true, "Rate is required"],
      min: [0, "Rate cannot be negative"],
    },

    gstRate: {
      type: Number,
      required: [true, "GST rate is required"],
      enum: {
        values: [0, 5, 12, 18, 28],
        message: "GST rate must be 0, 5, 12, 18, or 28",
      },
    },

    // ✅ Calculated values
    amount: {
      type: Number, // qty * rate
      required: true,
    },

    gstAmount: {
      type: Number, // amount * gstRate/100
      required: true,
    },

    total: {
      type: Number, // amount + gstAmount
      required: true,
    },
  },
  { _id: false }
);
//inv_num,inv_date,orderRef, dispatchVia,destination,buy_name,buy_address,buy_gstno,items:[{description,hsnCode,qty,unit,rate,gstRate}],totals:{subtotal,gst,total},createdBy,status
const invoiceSchema= new mongoose.Schema(
  {
    inv_num: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },

    inv_date: {
      type: Date,
      required: [true, "Invoice date is required"],
    },

    orderRef: {
      type: String,
      trim: true,
      default: "Verbal Order",
    },

    dispatchVia: {
      type: String,
      trim: true,
      default: "By Courier",
    },

    destination: {
      type: String,
      trim: true,
      required: [true, "Destination is required"],
    },

    buy_name: {
      type: String,
      required: [true, "Buyer name is required"],
      trim: true,
    },

    buy_address: {
      type: String,
      required: [true, "Buyer address is required"],
      trim: true,
    },

    buy_gstno: {
      type: String,
      required: [true, "Buyer GSTIN is required"],
      trim: true,
      uppercase: true,
      minlength: 15,
      maxlength: 15,
      validate: {
        validator: (v) =>
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v),
        message: (props) => `${props.value} is not a valid GSTIN`,
      },
    },

    items: {
      type: [ItemSchema],
      required: [true, "At least one item is required"],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Invoice must have at least one item",
      },
    },

    totals: {
      subtotal: Number,
      gst: Number,
      fri:Number,
      total: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy (userId) is required"],
    },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true }
);
module.exports=mongoose.model("Invoice",invoiceSchema)