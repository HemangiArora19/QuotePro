const mongoose = require("mongoose");
//clientName,clientEmail,quoteNumber,quoteDate,items[],subtotal,taxRate,taxAmount,notes,createdBy
const itemSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: 1
    },
    discount:{type:Number,default:0},
    rate: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const offerSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true
    },
    clientEmail: {
      type: String,
      required:true
    },
    clientAddress: {
      type: String,
      required:true
    },
    quoteNumber: {
      type: String,
      required: true,
      unique: true
    },
    quoteDate: {
      type: Date,
      required: true
    },
    items: {
      type: [itemSchema],
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Offer", offerSchema);
