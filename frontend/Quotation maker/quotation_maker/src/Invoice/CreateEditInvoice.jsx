
// import Navbar from "../Navbar/Navbar";
// import api from "../axios/axios";
// import Swal from "sweetalert2";
// import { useState, useEffect } from "react";
// import { useLocation } from "react-router";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const GST_RATES = [0, 5, 12, 18, 28];
// const UNITS = ["NOS", "KGS", "LTR", "MTR", "BOX", "PCS", "SET"];
// const DISPATCH_OPTIONS = ["By Courier", "By Road", "By Air", "By Rail", "Hand Delivery"];
// const EMPTY_ITEM = { description: "", hsnCode: "", qty: 1, unit: "NOS", rate: 0, discount: 0, gstRate: 18 };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const todayStr = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
// };

// const fmt = (n) =>
//   "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// function calcItem(item) {
//   const rate        = Number(item.rate) || 0;
//   const discount    = Number(item.discount) || 0;
//   const discountAmt = +(rate * discount / 100).toFixed(2);
//   const discountedRate = +(rate - discountAmt).toFixed(2);
//   const taxable     = +((Number(item.qty) || 0) * discountedRate).toFixed(2);
//   const tax         = +(taxable * ((Number(item.gstRate) || 0) / 100)).toFixed(2);
//   return { taxable, tax, total: +(taxable + tax).toFixed(2), discountedRate, discountAmt };
// }

// function ErrorMsg({ msg }) {
//   return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
// }

// // ─── Shared class strings (QuotePro style) ────────────────────────────────────
// const inputCls =
//   "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";
// const selectCls =
//   "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white";

// // ─── Main Form ────────────────────────────────────────────────────────────────
// export default function CreateEditInvoice({ onSubmit }) {

//   // ── State ──
//   const [invoice, setInvoice] = useState({
//     inv_num:     "",
//     inv_date:    todayStr(),
//     orderRef:    "Verbal Order",
//     dipacthVia:  "By Courier",
//     destination: "",
//   });
// const [editData,setData]=useState(null);
// const location=useLocation();

//   const [buyer, setBuyer] = useState({
//     buy_name:    "",
//     buy_address: "",
//     buy_gstno:   "",
//   });

//   const [items, setItems]       = useState([{ ...EMPTY_ITEM }]);
//   const [errors, setErrors]     = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted]   = useState(false);

//   // ── Handlers ──
//   const setInvoiceField = (k, v) => setInvoice((p) => ({ ...p, [k]: v }));
//   const setBuyerField   = (k, v) => setBuyer((p) => ({ ...p, [k]: v }));
//   const setItemField    = (idx, k, v) =>
//     setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [k]: v } : it)));
//   const addItem    = () => setItems((p) => [...p, { ...EMPTY_ITEM }]);
//   const removeItem = (idx) => {
//     if (items.length > 1) setItems((p) => p.filter((_, i) => i !== idx));
//     else alert("At least one item is required");
//   };

//   // ── Validation ──
//   function validate() {
//     const e = {};
//     if (!invoice.inv_num.trim())     e.inv_num     = "Invoice number is required";
//     if (!invoice.inv_date.trim())    e.inv_date    = "Invoice date is required";
//     if (!invoice.destination.trim()) e.destination = "Destination is required";
//     if (!buyer.buy_name.trim())      e.buy_name    = "Buyer name is required";
//     if (!buyer.buy_address.trim())   e.buy_address = "Buyer address is required";
//     if (!buyer.buy_gstno.trim()) {
//       e.buy_gstno = "GSTIN is required";
//     } else if (
//       !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
//         buyer.buy_gstno.toUpperCase()
//       )
//     ) {
//       e.buy_gstno = "Invalid GSTIN format (e.g. 02AARFM0588N1ZR)";
//     }
//     items.forEach((item, i) => {
//       if (!item.description.trim())             e[`item_${i}_desc`] = "Required";
//       if (!item.hsnCode.trim())                 e[`item_${i}_hsn`]  = "Required";
//       if (!item.qty || Number(item.qty) <= 0)   e[`item_${i}_qty`]  = "Must be > 0";
//       if (!item.rate || Number(item.rate) <= 0) e[`item_${i}_rate`] = "Must be > 0";
//     });
//     return e;
//   }

//   // ── Submit ──
//   async function handleSubmit(e) {
//     e.preventDefault();
//     const errs = validate();
//     if (Object.keys(errs).length) { setErrors(errs); return; }
//     setErrors({});
//     setSubmitting(true);
//     const payload = {
//   inv_num: invoice.inv_num,
//   inv_date: invoice.inv_date,
//   orderRef: invoice.orderRef,
//   dispatchVia: invoice.dipacthVia, // ⚠️ spelling fix
//   destination: invoice.destination,

//   buy_name: buyer.buy_name,
//   buy_address: buyer.buy_address,
//   buy_gstno: buyer.buy_gstno.toUpperCase(),

//   items: items.map(it => {
//     const amount = Number(it.qty) * Number(it.rate);
//     const gstAmount = amount * Number(it.gstRate) / 100;
//     const total = amount + gstAmount;

//     return {
//       description: it.description,
//       hsnCode: it.hsnCode,
//       qty: Number(it.qty),
//       unit: it.unit,
//       rate: Number(it.rate),
//       gstRate: Number(it.gstRate),

//       // required by ItemSchema
//       amount,
//       gstAmount,
//       total
//     };
//   }),

//   totals: {
//     subtotal: items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0),
//     gst: items.reduce((s, it) => {
//       const amt = Number(it.qty) * Number(it.rate);
//       return s + (amt * Number(it.gstRate) / 100);
//     }, 0),
//     total: items.reduce((s, it) => {
//       const amt = Number(it.qty) * Number(it.rate);
//       const gst = amt * Number(it.gstRate) / 100;
//       return s + amt + gst;
//     }, 0),
//   },

//   status: "draft"
// };

//     try {
//       if (onSubmit) {
//         await onSubmit(payload);
//       } else {
//         const res = await api.post("/invoice/create",payload);
//         if (!res) throw new Error(`Server error ${res.status}`);
//         Swal.fire({
//           icon:"success",
//           title:"Invoice Created",
//           text:"Your invoice has been created successfully."
//         })
//       }
//       setSubmitted(true);
//     } catch (err) {
//       setErrors({ submit: err.message });
//     } finally {
//       setSubmitting(false);
//     }
//   }
//   const [edit,setEdit]=useState(false);
//   useEffect(()=>{
// if(location.state && location.state.invoice){
//   setEdit(location.state.isEdit);
//   setData(location.state.invoice);
// }
//   },[location])

//   //validate the data when it is done
 
//   useEffect(()=>{
//    if(!editData) return;
//    if(!edit) return;
//     //set the invoice data
//     setInvoice({
//   inv_num: editData.inv_num,
//   inv_date: editData.inv_date.split("T")[0],
//   orderRef: editData.orderRef,
//   dipacthVia: editData.dispatchVia, // ⚠️ spelling fix
//   destination: editData.destination,
//     })
//     //set the buyer data
//     setBuyer({
//   buy_name: editData.buy_name,
//   buy_address: editData.buy_address,
//   buy_gstno: editData.buy_gstno.toUpperCase(),
//     })
//     //set the items data
//     setItems(editData.items.map(it=>{
//       return{
//         description: it.description,
//       hsnCode: it.hsnCode,
// qty: it.qty,
// unit: it.unit,
// rate: it.rate,
// gstRate: it.gstRate,
//       }
//     }))
//     //set the totals data
// //   
      


//   },[editData])

//   // ── Totals ──
//   const [taxType, setTaxType] = useState("IGST"); // "IGST" | "CGST+SGST"
//   const freightItem    = items.find((it) => it.description.toLowerCase().includes("freight"));
//   const freightAmt     = freightItem ? (Number(freightItem.qty) || 0) * (Number(freightItem.rate) || 0) : 0;
//   const [freightPct, setFreightPct] = useState(0);
//   const grandSubtotal  = items.reduce((s, it) => s + calcItem(it).taxable, 0);
//   const freightCalc    = freightAmt > 0 ? freightAmt : +(grandSubtotal * freightPct / 100).toFixed(2);
//   const grandTax       = items.reduce((s, it) => s + calcItem(it).tax, 0);
//   const cgst           = +(grandTax / 2).toFixed(2);
//   const sgst           = +(grandTax / 2).toFixed(2);
//   const grandTotal     = +(grandSubtotal + freightCalc + grandTax).toFixed(2);
//   // Dynamic GST rates from items (weighted average or most common rate)
//   const igstRate       = grandSubtotal > 0 ? +((grandTax / grandSubtotal) * 100).toFixed(2) : 0;
//   const halfRate       = +(igstRate / 2).toFixed(2);

//   // ── Success screen ──
//   if (submitted) return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
//         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
//           <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Created!</h2>
//         <p className="text-gray-500 mb-6">
//           Invoice <span className="font-bold text-blue-600">#{invoice.inv_num}</span> has been saved successfully.
//         </p>
//         <button
//           onClick={() => {
//             setSubmitted(false);
//             setInvoice({ inv_num: "", inv_date: todayStr(), orderRef: "Verbal Order", dispatchVia: "By Courier", destination: "" });
//             setBuyer({ buy_name: "", buy_address: "", buy_gstno: "" });
//             setItems([{ ...EMPTY_ITEM }]);
//           }}
//           className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg"
//         >
//           Create Another
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

//       {/* ── Navbar ── */}
//       <Navbar/>

//       <div className="max-w-5xl mx-auto px-6 py-10">

//         {/* ── Page Heading ── */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Invoice</h1>
//           <p className="text-gray-600">Fill in the details to generate your GST tax invoice</p>
//         </div>

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="bg-white rounded-2xl shadow-xl p-8">

//             {/* ══ 1. Invoice Details ══ */}
//             <div className="mb-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
//                 Invoice Details
//               </h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
//                   <input
//                     type="text"
//                     value={invoice.inv_num}
//                     onChange={(e) => setInvoiceField("inv_num", e.target.value)}
//                     placeholder="e.g. 715"
//                     className={inputCls}
//                   />
//                   <ErrorMsg msg={errors.inv_num} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
//                   <input
//                     type="date"
//                     value={invoice.inv_date}
//                     onChange={(e) => setInvoiceField("inv_date", e.target.value)}
//                     className={inputCls}
//                   />
//                   <ErrorMsg msg={errors.inv_date} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Order Reference</label>
//                   <input
//                     type="text"
//                     value={invoice.orderRef}
//                     onChange={(e) => setInvoiceField("orderRef", e.target.value)}
//                     placeholder="e.g. Verbal Order / PO-123"
//                     className={inputCls}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Via</label>
//                   <select
//                     value={invoice.dipacthVia}
//                     onChange={(e) => setInvoiceField("dipacthVia", e.target.value)}
//                     className={selectCls}
//                   >
//                     {DISPATCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
//                   </select>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
//                   <input
//                     type="text"
//                     value={invoice.destination}
//                     onChange={(e) => setInvoiceField("destination", e.target.value)}
//                     placeholder="e.g. Baddi, Delhi, Mumbai"
//                     className={inputCls}
//                   />
//                   <ErrorMsg msg={errors.destination} />
//                 </div>
//               </div>
//             </div>

//             {/* ══ 2. Buyer Details ══ */}
//             <div className="mb-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
//                 Buyer Details
//               </h2>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name *</label>
//                   <input
//                     type="text"
//                     value={buyer.buy_name}
//                     onChange={(e) => setBuyerField("buy_name", e.target.value)}
//                     placeholder="e.g. MEDICEF PHARMA"
//                     className={inputCls}
//                   />
//                   <ErrorMsg msg={errors.buy_name} />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Buyer GSTIN *</label>
//                   <input
//                     type="text"
//                     value={buyer.buy_gstno}
//                     onChange={(e) => setBuyerField("buy_gstno", e.target.value.toUpperCase())}
//                     placeholder="e.g. 02AARFM0588N1ZR"
//                     maxLength={15}
//                     className={`${inputCls} font-mono tracking-widest`}
//                   />
//                   {buyer.buy_gstno.length >= 2 && (
//                     <p className="text-xs text-blue-600 mt-1 font-medium">
//                       State Code: <span className="font-mono font-bold">{buyer.buy_gstno.substring(0, 2)}</span>
//                     </p>
//                   )}
//                   <ErrorMsg msg={errors.buy_gstno} />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Address *</label>
//                   <textarea
//                     rows={3}
//                     value={buyer.buy_address}
//                     onChange={(e) => setBuyerField("buy_address", e.target.value)}
//                     placeholder="Full address with pincode and state"
//                     className={`${inputCls} resize-none`}
//                   />
//                   <ErrorMsg msg={errors.buy_address} />
//                 </div>
//               </div>
//             </div>

//             {/* ══ 3. Line Items ══ */}
//             <div className="mb-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">3</span>
//                 Items / Services
//               </h2>

//               {/* Column headers — desktop */}
//               <div className="hidden lg:grid grid-cols-13 gap-3 mb-2 text-sm font-semibold text-gray-500 px-1" style={{gridTemplateColumns:"3fr 2fr 1fr 1fr 2fr 1.2fr 1.2fr 1.2fr 0.8fr"}}>
//                 <div>Description</div>
//                 <div>HSN / SAC</div>
//                 <div className="text-center">Qty</div>
//                 <div className="text-center">Unit</div>
//                 <div className="text-right">Rate (₹)</div>
//                 <div className="text-center">Disc %</div>
//                 <div className="text-right">Net Rate</div>
//                 <div className="text-center">GST %</div>
//                 <div className="text-right">Total (₹)</div>
//               </div>

//               {items.map((item, idx) => {
//                 const { total, discountedRate, discountAmt } = calcItem(item);
//                 return (
//                   <div key={idx} className="grid grid-cols-12 gap-3 mb-4 items-start lg:block">
//                   <div className="col-span-12 hidden lg:grid gap-3 mb-4 items-start"
//                     style={{gridTemplateColumns:"3fr 2fr 1fr 1fr 2fr 1.2fr 1.2fr 1.2fr 0.8fr auto"}}>

//                     {/* Description */}
//                     <div>
//                       <input type="text" value={item.description}
//                         onChange={(e) => setItemField(idx, "description", e.target.value)}
//                         placeholder="Item or service" className={inputCls} />
//                       <ErrorMsg msg={errors[`item_${idx}_desc`]} />
//                     </div>

//                     {/* HSN */}
//                     <div>
//                       <input type="text" value={item.hsnCode}
//                         onChange={(e) => setItemField(idx, "hsnCode", e.target.value)}
//                         placeholder="e.g. 8481" className={`${inputCls} font-mono`} />
//                       <ErrorMsg msg={errors[`item_${idx}_hsn`]} />
//                     </div>

//                     {/* Qty */}
//                     <div>
//                       <input type="number" min="1" value={item.qty}
//                         onChange={(e) => setItemField(idx, "qty", e.target.value)}
//                         className={inputCls} />
//                       <ErrorMsg msg={errors[`item_${idx}_qty`]} />
//                     </div>

//                     {/* Unit */}
//                     <div>
//                       <select value={item.unit} onChange={(e) => setItemField(idx, "unit", e.target.value)} className={selectCls}>
//                         {UNITS.map((u) => <option key={u}>{u}</option>)}
//                       </select>
//                     </div>

//                     {/* Rate */}
//                     <div>
//                       <input type="number" min="0" step="0.01" value={item.rate}
//                         onChange={(e) => setItemField(idx, "rate", e.target.value)}
//                         className={`${inputCls} font-mono`} />
//                       <ErrorMsg msg={errors[`item_${idx}_rate`]} />
//                     </div>

//                     {/* Discount % */}
//                     <div className="relative">
//                       <input type="number" min="0" max="100" step="0.1" value={item.discount}
//                         onChange={(e) => setItemField(idx, "discount", e.target.value)}
//                         placeholder="0" className={`${inputCls} pr-6 font-mono`} />
//                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
//                     </div>

//                     {/* Net Rate (read-only) */}
//                     <div className="relative">
//                       <input type="text" value={`₹${discountedRate.toFixed(2)}`} readOnly
//                         className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
//                       {discountAmt > 0 && (
//                         <span className="absolute -top-2 right-2 text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 rounded-full px-1.5">
//                           -{item.discount}%
//                         </span>
//                       )}
//                     </div>

//                     {/* GST Rate */}
//                     <div>
//                       <select value={item.gstRate} onChange={(e) => setItemField(idx, "gstRate", e.target.value)} className={selectCls}>
//                         {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
//                       </select>
//                     </div>

//                     {/* Line Total */}
//                     <div>
//                       <input type="text" value={`₹${total.toFixed(2)}`} readOnly
//                         className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
//                     </div>

//                     {/* Remove */}
//                     <div>
//                       <button type="button" onClick={() => removeItem(idx)}
//                         className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg leading-none">×</button>
//                     </div>
//                   </div>

//                   {/* ── Mobile layout ── */}
//                   <div className="col-span-12 lg:hidden grid grid-cols-12 gap-3">
//                     <div className="col-span-12">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
//                       <input type="text" value={item.description} onChange={(e) => setItemField(idx, "description", e.target.value)} placeholder="Item or service" className={inputCls} />
//                       <ErrorMsg msg={errors[`item_${idx}_desc`]} />
//                     </div>
//                     <div className="col-span-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">HSN / SAC *</label>
//                       <input type="text" value={item.hsnCode} onChange={(e) => setItemField(idx, "hsnCode", e.target.value)} placeholder="e.g. 8481" className={`${inputCls} font-mono`} />
//                       <ErrorMsg msg={errors[`item_${idx}_hsn`]} />
//                     </div>
//                     <div className="col-span-3">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
//                       <input type="number" min="1" value={item.qty} onChange={(e) => setItemField(idx, "qty", e.target.value)} className={inputCls} />
//                       <ErrorMsg msg={errors[`item_${idx}_qty`]} />
//                     </div>
//                     <div className="col-span-3">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
//                       <select value={item.unit} onChange={(e) => setItemField(idx, "unit", e.target.value)} className={selectCls}>
//                         {UNITS.map((u) => <option key={u}>{u}</option>)}
//                       </select>
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
//                       <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => setItemField(idx, "rate", e.target.value)} className={`${inputCls} font-mono`} />
//                       <ErrorMsg msg={errors[`item_${idx}_rate`]} />
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
//                       <div className="relative">
//                         <input type="number" min="0" max="100" step="0.1" value={item.discount} onChange={(e) => setItemField(idx, "discount", e.target.value)} placeholder="0" className={`${inputCls} pr-6 font-mono`} />
//                         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
//                       </div>
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Net Rate</label>
//                       <input type="text" value={`₹${discountedRate.toFixed(2)}`} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
//                       <select value={item.gstRate} onChange={(e) => setItemField(idx, "gstRate", e.target.value)} className={selectCls}>
//                         {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
//                       </select>
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
//                       <input type="text" value={`₹${total.toFixed(2)}`} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
//                     </div>
//                     <div className="col-span-4">
//                       <label className="block text-sm font-medium text-gray-700 mb-1"> </label>
//                       <button type="button" onClick={() => removeItem(idx)} className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg leading-none">×</button>
//                     </div>
//                   </div>
//                   </div>
//                 );
//               })}

//               <button
//                 type="button"
//                 onClick={addItem}
//                 className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-md"
//               >
//                 + Add Another Item
//               </button>
//             </div>

//             {/* ══ 4. Invoice Summary ══ */}
//             <div className="mb-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//                 <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">4</span>
//                 Invoice Summary
//               </h2>

//               {/* Tax Type Toggle */}
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="text-sm font-medium text-gray-700">Tax Type:</span>
//                 <div className="flex rounded-lg border border-gray-300 overflow-hidden">
//                   <button
//                     type="button"
//                     onClick={() => setTaxType("IGST")}
//                     className={`px-4 py-2 text-sm font-semibold transition ${
//                       taxType === "IGST"
//                         ? "bg-blue-600 text-white"
//                         : "bg-white text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     IGST
//                     <span className="block text-[10px] font-normal opacity-75">Inter-State</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setTaxType("CGST+SGST")}
//                     className={`px-4 py-2 text-sm font-semibold border-l border-gray-300 transition ${
//                       taxType === "CGST+SGST"
//                         ? "bg-blue-600 text-white"
//                         : "bg-white text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     CGST + SGST
//                     <span className="block text-[10px] font-normal opacity-75">Same State</span>
//                   </button>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <div className="w-full md:w-96 space-y-4">

//                   {/* Subtotal */}
//                   <div className="flex justify-between items-center text-gray-700">
//                     <span className="font-medium">Subtotal (Taxable):</span>
//                     <span className="text-xl font-bold">{fmt(grandSubtotal)}</span>
//                   </div>

//                   {/* Freight Charges — percentage based */}
//                   <div className="flex justify-between items-start text-gray-700">
//                     <div>
//                       <span className="font-medium block">Freight Charges</span>
//                       {freightAmt > 0 ? (
//                         <span className="text-xs bg-gray-100 text-gray-400 font-semibold px-2 py-0.5 rounded-full">from items</span>
//                       ) : (
//                         <div className="flex items-center gap-1 mt-1">
//                           <input
//                             type="number"
//                             min="0"
//                             max="100"
//                             step="0.1"
//                             value={freightPct}
//                             onChange={(e) => setFreightPct(parseFloat(e.target.value) || 0)}
//                             className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm font-mono text-right"
//                           />
//                           <span className="text-sm font-semibold text-gray-500">% of subtotal</span>
//                         </div>
//                       )}
//                     </div>
//                     <span className="text-xl font-bold">{fmt(freightCalc)}</span>
//                   </div>

//                   {/* Tax rows — split based on taxType */}
//                   {taxType === "IGST" ? (
//                     <div className="flex justify-between items-center text-gray-700">
//                       <span className="font-medium">IGST <span className="text-gray-400 text-xs">({igstRate}%)</span>:</span>
//                       <span className="text-xl font-bold">{fmt(grandTax)}</span>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="flex justify-between items-center text-gray-700">
//                         <span className="font-medium">CGST <span className="text-gray-400 text-xs">({halfRate}%)</span>:</span>
//                         <span className="text-xl font-bold">{fmt(cgst)}</span>
//                       </div>
//                       <div className="flex justify-between items-center text-gray-700">
//                         <span className="font-medium">SGST <span className="text-gray-400 text-xs">({halfRate}%)</span>:</span>
//                         <span className="text-xl font-bold">{fmt(sgst)}</span>
//                       </div>
//                     </>
//                   )}

//                   {/* Grand Total */}
//                   <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
//                     <span className="text-xl font-bold text-gray-800">Grand Total:</span>
//                     <span className="text-3xl font-bold text-blue-600">{fmt(grandTotal)}</span>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* ── Submit Error ── */}
//             {errors.submit && (
//               <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 font-medium">
//                 ⚠ {errors.submit}
//               </div>
//             )}

//             {/* ── Action Buttons ── */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="flex-1 px-8 py-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-bold text-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {submitting ? (
//                   <>
//                     <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     Saving…
//                   </>
//                 ) : (
//                   "Create Invoice"
//                 )}
//               </button>
//             </div>

//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import api from "../axios/axios";
import Swal from "sweetalert2";

// ─── Constants ────────────────────────────────────────────────────────────────
const GST_RATES = [0, 5, 12, 18, 28];
const UNITS = ["NOS", "KGS", "LTR", "MTR", "BOX", "PCS", "SET"];
const DISPATCH_OPTIONS = ["By Courier", "By Road", "By Air", "By Rail", "Hand Delivery"];
const EMPTY_ITEM = { description: "", hsnCode: "", qty: 1, unit: "NOS", rate: 0, discount: 0, gstRate: 18 };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const fmt = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function calcItem(item) {
  const rate           = Number(item.rate) || 0;
  const discount       = Number(item.discount) || 0;
  const discountAmt    = +(rate * discount / 100).toFixed(2);
  const discountedRate = +(rate - discountAmt).toFixed(2);
  const taxable        = +((Number(item.qty) || 0) * discountedRate).toFixed(2);
  const tax            = +(taxable * ((Number(item.gstRate) || 0) / 100)).toFixed(2);
  return { taxable, tax, total: +(taxable + tax).toFixed(2), discountedRate, discountAmt };
}

function ErrorMsg({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

const inputCls =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm";
const selectCls =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm bg-white";

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function CreateEditInvoice({ onSubmit }) {

  const location = useLocation();
  const navigate = useNavigate();

  // ── State ──
  const [editData, setEditData] = useState(null);
  const [isEdit,   setIsEdit]   = useState(false);

  const [invoice, setInvoice] = useState({
    inv_num:     "",
    inv_date:    todayStr(),
    orderRef:    "Verbal Order",
    dipacthVia:  "By Courier",
    destination: "",
  });

  const [buyer, setBuyer] = useState({
    buy_name:    "",
    buy_address: "",
    buy_gstno:   "",
  });

  const [items,      setItems]      = useState([{ ...EMPTY_ITEM }]);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [taxType,    setTaxType]    = useState("IGST");
  const [freightPct, setFreightPct] = useState(0);

  // ── Load edit data from route state ──
  useEffect(() => {
    if (location.state?.invoice) {
      setIsEdit(!!location.state.isEdit);
      setEditData(location.state.invoice);
    }
  }, [location]);

  // ── Populate form when editData is set ──
  useEffect(() => {
    if (!editData || !isEdit) return;

    setInvoice({
      inv_num:     editData.inv_num     ?? "",
      inv_date:    editData.inv_date?.split("T")[0] ?? todayStr(),
      orderRef:    editData.orderRef    ?? "Verbal Order",
      dipacthVia:  editData.dispatchVia ?? "By Courier",
      destination: editData.destination ?? "",
    });

    setBuyer({
      buy_name:    editData.buy_name    ?? "",
      buy_address: editData.buy_address ?? "",
      buy_gstno:   editData.buy_gstno?.toUpperCase() ?? "",
    });

    setItems(
      editData.items?.map((it) => ({
        description: it.description ?? "",
        hsnCode:     it.hsnCode     ?? "",
        qty:         it.qty         ?? 1,
        unit:        it.unit        ?? "NOS",
        rate:        it.rate        ?? 0,
        discount:    it.discount    ?? 0,
        gstRate:     it.gstRate     ?? 18,
      })) ?? [{ ...EMPTY_ITEM }]
    );
  }, [editData, isEdit]);

  // ── Field Handlers ──
  const setInvoiceField = (k, v) => setInvoice((p) => ({ ...p, [k]: v }));
  const setBuyerField   = (k, v) => setBuyer((p) => ({ ...p, [k]: v }));
  const setItemField    = (idx, k, v) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [k]: v } : it)));
  const addItem    = () => setItems((p) => [...p, { ...EMPTY_ITEM }]);
  const removeItem = (idx) => {
    if (items.length > 1) setItems((p) => p.filter((_, i) => i !== idx));
    else alert("At least one item is required");
  };

  // ── Validation ──
  function validate() {
    const e = {};
    if (!invoice.inv_num.trim())     e.inv_num     = "Invoice number is required";
    if (!invoice.inv_date.trim())    e.inv_date    = "Invoice date is required";
    if (!invoice.destination.trim()) e.destination = "Destination is required";
    if (!buyer.buy_name.trim())      e.buy_name    = "Buyer name is required";
    if (!buyer.buy_address.trim())   e.buy_address = "Buyer address is required";
    if (!buyer.buy_gstno.trim()) {
      e.buy_gstno = "GSTIN is required";
    } else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
        buyer.buy_gstno.toUpperCase()
      )
    ) {
      e.buy_gstno = "Invalid GSTIN format (e.g. 02AARFM0588N1ZR)";
    }
    items.forEach((item, i) => {
      if (!item.description.trim())             e[`item_${i}_desc`] = "Required";
      if (!item.hsnCode.trim())                 e[`item_${i}_hsn`]  = "Required";
      if (!item.qty || Number(item.qty) <= 0)   e[`item_${i}_qty`]  = "Must be > 0";
      if (!item.rate || Number(item.rate) <= 0) e[`item_${i}_rate`] = "Must be > 0";
    });
    return e;
  }

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const payload = {
      inv_num:     invoice.inv_num,
      inv_date:    invoice.inv_date,
      orderRef:    invoice.orderRef,
      dispatchVia: invoice.dipacthVia,
      destination: invoice.destination,
      buy_name:    buyer.buy_name,
      buy_address: buyer.buy_address,
      buy_gstno:   buyer.buy_gstno.toUpperCase(),
      items: items.map((it) => {
        const amount    = Number(it.qty) * Number(it.rate);
        const gstAmount = amount * Number(it.gstRate) / 100;
        const total     = amount + gstAmount;
        return {
          description: it.description,
          hsnCode:     it.hsnCode,
          qty:         Number(it.qty),
          unit:        it.unit,
          rate:        Number(it.rate),
          gstRate:     Number(it.gstRate),
          amount,
          gstAmount,
          total,
        };
      }),
      totals: {
        subtotal: items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0),
        gst: items.reduce((s, it) => {
          const amt = Number(it.qty) * Number(it.rate);
          return s + (amt * Number(it.gstRate) / 100);
        }, 0),
        total: items.reduce((s, it) => {
          const amt = Number(it.qty) * Number(it.rate);
          const gst = amt * Number(it.gstRate) / 100;
          return s + amt + gst;
        }, 0),
        fri:freightPct,
      },
      status: editData?.status ?? "draft",
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else if (isEdit && editData) {
        // ── Edit mode ──
        const res = await api.post(`invoice/editById/${editData._id}`, payload);
        if (!res) throw new Error("Server error while updating");
        Swal.fire({ icon: "success", title: "Invoice Updated", text: "Invoice updated successfully." });
        navigate("/display_invoice");
      } else {
        // ── Create mode ──
        const res = await api.post("/invoice/create", payload);
        if (!res) throw new Error("Server error while creating");
        Swal.fire({ icon: "success", title: "Invoice Created", text: "Invoice created successfully." });
        
      }
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Totals ──
  const freightItem   = items.find((it) => it.description.toLowerCase().includes("freight"));
  const freightAmt    = freightItem ? (Number(freightItem.qty) || 0) * (Number(freightItem.rate) || 0) : 0;
  const grandSubtotal = items.reduce((s, it) => s + calcItem(it).taxable, 0);
  const freightCalc   = freightAmt > 0 ? freightAmt : +(grandSubtotal * freightPct / 100).toFixed(2);
  const grandTax      = items.reduce((s, it) => s + calcItem(it).tax, 0);
  const cgst          = +(grandTax / 2).toFixed(2);
  const sgst          = +(grandTax / 2).toFixed(2);
  const grandTotal    = +(grandSubtotal + freightCalc + grandTax).toFixed(2);
  const igstRate      = grandSubtotal > 0 ? +((grandTax / grandSubtotal) * 100).toFixed(2) : 0;
  const halfRate      = +(igstRate / 2).toFixed(2);

  // ── Success screen ──
  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Created!</h2>
        <p className="text-gray-500 mb-6">
          Invoice <span className="font-bold text-blue-600">#{invoice.inv_num}</span> has been saved successfully.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setInvoice({ inv_num: "", inv_date: todayStr(), orderRef: "Verbal Order", dipacthVia: "By Courier", destination: "" });
            setBuyer({ buy_name: "", buy_address: "", buy_gstno: "" });
            setItems([{ ...EMPTY_ITEM }]);
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold shadow-lg"
        >
          Create Another
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEdit ? "Edit Invoice" : "Create Invoice"}
          </h1>
          <p className="text-gray-600">Fill in the details to generate your GST tax invoice</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl shadow-xl p-8">

            {/* ══ 1. Invoice Details ══ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                Invoice Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                  <input type="text" value={invoice.inv_num}
                    onChange={(e) => setInvoiceField("inv_num", e.target.value)}
                    placeholder="e.g. 715" className={inputCls} />
                  <ErrorMsg msg={errors.inv_num} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date *</label>
                  <input type="date" value={invoice.inv_date}
                    onChange={(e) => setInvoiceField("inv_date", e.target.value)}
                    className={inputCls} />
                  <ErrorMsg msg={errors.inv_date} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Reference</label>
                  <input type="text" value={invoice.orderRef}
                    onChange={(e) => setInvoiceField("orderRef", e.target.value)}
                    placeholder="e.g. Verbal Order / PO-123" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dispatch Via</label>
                  <select value={invoice.dipacthVia}
                    onChange={(e) => setInvoiceField("dipacthVia", e.target.value)}
                    className={selectCls}>
                    {DISPATCH_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                  <input type="text" value={invoice.destination}
                    onChange={(e) => setInvoiceField("destination", e.target.value)}
                    placeholder="e.g. Baddi, Delhi, Mumbai" className={inputCls} />
                  <ErrorMsg msg={errors.destination} />
                </div>
              </div>
            </div>

            {/* ══ 2. Buyer Details ══ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                Buyer Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name *</label>
                  <input type="text" value={buyer.buy_name}
                    onChange={(e) => setBuyerField("buy_name", e.target.value)}
                    placeholder="e.g. MEDICEF PHARMA" className={inputCls} />
                  <ErrorMsg msg={errors.buy_name} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buyer GSTIN *</label>
                  <input type="text" value={buyer.buy_gstno}
                    onChange={(e) => setBuyerField("buy_gstno", e.target.value.toUpperCase())}
                    placeholder="e.g. 02AARFM0588N1ZR" maxLength={15}
                    className={`${inputCls} font-mono tracking-widest`} />
                  {buyer.buy_gstno.length >= 2 && (
                    <p className="text-xs text-blue-600 mt-1 font-medium">
                      State Code: <span className="font-mono font-bold">{buyer.buy_gstno.substring(0, 2)}</span>
                    </p>
                  )}
                  <ErrorMsg msg={errors.buy_gstno} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Address *</label>
                  <textarea rows={3} value={buyer.buy_address}
                    onChange={(e) => setBuyerField("buy_address", e.target.value)}
                    placeholder="Full address with pincode and state"
                    className={`${inputCls} resize-none`} />
                  <ErrorMsg msg={errors.buy_address} />
                </div>
              </div>
            </div>

            {/* ══ 3. Line Items ══ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                Items / Services
              </h2>

              <div className="hidden lg:grid gap-3 mb-2 text-sm font-semibold text-gray-500 px-1"
                style={{ gridTemplateColumns: "3fr 2fr 1fr 1fr 2fr 1.2fr 1.2fr 1.2fr 0.8fr" }}>
                <div>Description</div><div>HSN / SAC</div>
                <div className="text-center">Qty</div><div className="text-center">Unit</div>
                <div className="text-right">Rate (₹)</div><div className="text-center">Disc %</div>
                <div className="text-right">Net Rate</div><div className="text-center">GST %</div>
                <div className="text-right">Total (₹)</div>
              </div>

              {items.map((item, idx) => {
                const { total, discountedRate, discountAmt } = calcItem(item);
                return (
                  <div key={idx} className="grid grid-cols-12 gap-3 mb-4 items-start lg:block">
                    {/* Desktop */}
                    <div className="col-span-12 hidden lg:grid gap-3 mb-4 items-start"
                      style={{ gridTemplateColumns: "3fr 2fr 1fr 1fr 2fr 1.2fr 1.2fr 1.2fr 0.8fr auto" }}>
                      <div>
                        <input type="text" value={item.description}
                          onChange={(e) => setItemField(idx, "description", e.target.value)}
                          placeholder="Item or service" className={inputCls} />
                        <ErrorMsg msg={errors[`item_${idx}_desc`]} />
                      </div>
                      <div>
                        <input type="text" value={item.hsnCode}
                          onChange={(e) => setItemField(idx, "hsnCode", e.target.value)}
                          placeholder="e.g. 8481" className={`${inputCls} font-mono`} />
                        <ErrorMsg msg={errors[`item_${idx}_hsn`]} />
                      </div>
                      <div>
                        <input type="number" min="1" value={item.qty}
                          onChange={(e) => setItemField(idx, "qty", e.target.value)} className={inputCls} />
                        <ErrorMsg msg={errors[`item_${idx}_qty`]} />
                      </div>
                      <div>
                        <select value={item.unit} onChange={(e) => setItemField(idx, "unit", e.target.value)} className={selectCls}>
                          {UNITS.map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <input type="number" min="0" step="0.01" value={item.rate}
                          onChange={(e) => setItemField(idx, "rate", e.target.value)}
                          className={`${inputCls} font-mono`} />
                        <ErrorMsg msg={errors[`item_${idx}_rate`]} />
                      </div>
                      <div className="relative">
                        <input type="number" min="0" max="100" step="0.1" value={item.discount}
                          onChange={(e) => setItemField(idx, "discount", e.target.value)}
                          placeholder="0" className={`${inputCls} pr-6 font-mono`} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                      </div>
                      <div className="relative">
                        <input type="text" value={`₹${discountedRate.toFixed(2)}`} readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
                        {discountAmt > 0 && (
                          <span className="absolute -top-2 right-2 text-[10px] text-green-600 font-bold bg-green-50 border border-green-200 rounded-full px-1.5">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      <div>
                        <select value={item.gstRate} onChange={(e) => setItemField(idx, "gstRate", e.target.value)} className={selectCls}>
                          {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </div>
                      <div>
                        <input type="text" value={`₹${total.toFixed(2)}`} readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
                      </div>
                      <div>
                        <button type="button" onClick={() => removeItem(idx)}
                          className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg leading-none">×</button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="col-span-12 lg:hidden grid grid-cols-12 gap-3">
                      <div className="col-span-12">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <input type="text" value={item.description} onChange={(e) => setItemField(idx, "description", e.target.value)} placeholder="Item or service" className={inputCls} />
                        <ErrorMsg msg={errors[`item_${idx}_desc`]} />
                      </div>
                      <div className="col-span-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">HSN / SAC *</label>
                        <input type="text" value={item.hsnCode} onChange={(e) => setItemField(idx, "hsnCode", e.target.value)} placeholder="e.g. 8481" className={`${inputCls} font-mono`} />
                        <ErrorMsg msg={errors[`item_${idx}_hsn`]} />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                        <input type="number" min="1" value={item.qty} onChange={(e) => setItemField(idx, "qty", e.target.value)} className={inputCls} />
                        <ErrorMsg msg={errors[`item_${idx}_qty`]} />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select value={item.unit} onChange={(e) => setItemField(idx, "unit", e.target.value)} className={selectCls}>
                          {UNITS.map((u) => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                        <input type="number" min="0" step="0.01" value={item.rate} onChange={(e) => setItemField(idx, "rate", e.target.value)} className={`${inputCls} font-mono`} />
                        <ErrorMsg msg={errors[`item_${idx}_rate`]} />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                        <div className="relative">
                          <input type="number" min="0" max="100" step="0.1" value={item.discount} onChange={(e) => setItemField(idx, "discount", e.target.value)} placeholder="0" className={`${inputCls} pr-6 font-mono`} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</span>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Net Rate</label>
                        <input type="text" value={`₹${discountedRate.toFixed(2)}`} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
                        <select value={item.gstRate} onChange={(e) => setItemField(idx, "gstRate", e.target.value)} className={selectCls}>
                          {GST_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
                        </select>
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <input type="text" value={`₹${total.toFixed(2)}`} readOnly className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold text-sm text-right" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1"> </label>
                        <button type="button" onClick={() => removeItem(idx)} className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-lg leading-none">×</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button type="button" onClick={addItem}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-md">
                + Add Another Item
              </button>
            </div>

            {/* ══ 4. Invoice Summary ══ */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                Invoice Summary
              </h2>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-gray-700">Tax Type:</span>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button type="button" onClick={() => setTaxType("IGST")}
                    className={`px-4 py-2 text-sm font-semibold transition ${taxType === "IGST" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                    IGST <span className="block text-[10px] font-normal opacity-75">Inter-State</span>
                  </button>
                  <button type="button" onClick={() => setTaxType("CGST+SGST")}
                    className={`px-4 py-2 text-sm font-semibold border-l border-gray-300 transition ${taxType === "CGST+SGST" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                    CGST + SGST <span className="block text-[10px] font-normal opacity-75">Same State</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="w-full md:w-96 space-y-4">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Subtotal (Taxable):</span>
                    <span className="text-xl font-bold">{fmt(grandSubtotal)}</span>
                  </div>
                  <div className="flex justify-between items-start text-gray-700">
                    <div>
                      <span className="font-medium block">Freight Charges</span>
                      {freightAmt > 0 ? (
                        <span className="text-xs bg-gray-100 text-gray-400 font-semibold px-2 py-0.5 rounded-full">from items</span>
                      ) : (
                        <div className="flex items-center gap-1 mt-1">
                          <input type="number" min="0" max="100" step="0.1" value={freightPct}
                            onChange={(e) => setFreightPct(parseFloat(e.target.value) || 0)}
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm font-mono text-right" />
                          <span className="text-sm font-semibold text-gray-500">% of subtotal</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xl font-bold">{fmt(freightCalc)}</span>
                  </div>
                  {taxType === "IGST" ? (
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-medium">IGST <span className="text-gray-400 text-xs">({igstRate}%)</span>:</span>
                      <span className="text-xl font-bold">{fmt(grandTax)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">CGST <span className="text-gray-400 text-xs">({halfRate}%)</span>:</span>
                        <span className="text-xl font-bold">{fmt(cgst)}</span>
                      </div>
                      <div className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">SGST <span className="text-gray-400 text-xs">({halfRate}%)</span>:</span>
                        <span className="text-xl font-bold">{fmt(sgst)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                    <span className="text-xl font-bold text-gray-800">Grand Total:</span>
                    <span className="text-3xl font-bold text-blue-600">{fmt(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Submit Error ── */}
            {errors.submit && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-600 font-medium">
                ⚠ {errors.submit}
              </div>
            )}

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="button" onClick={() => window.history.back()}
                className="flex-1 px-8 py-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-bold text-lg">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : isEdit ? "Update Invoice" : "Create Invoice"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}