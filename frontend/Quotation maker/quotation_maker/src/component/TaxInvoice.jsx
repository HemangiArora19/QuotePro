// import { useState, useEffect, useRef } from "react";
// import api from "../axios/axios";
// import { useLocation } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
// import Swal from "sweetalert2";

// // ─── Helpers ────────────────────────────────────────────────────────────────
// const fmt = (n) =>
//   "₹" +
//   Number(n).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const fmtNum = (n) =>
//   Number(n).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const ONES = [
//   "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
//   "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
//   "Seventeen", "Eighteen", "Nineteen",
// ];
// const TENS = [
//   "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
// ];

// function wordsHelper(num) {
//   if (num === 0) return "";
//   if (num < 20) return ONES[num] + " ";
//   if (num < 100) return TENS[Math.floor(num / 10)] + (num % 10 ? " " + ONES[num % 10] : "") + " ";
//   if (num < 1000) return ONES[Math.floor(num / 100)] + " Hundred " + wordsHelper(num % 100);
//   if (num < 100000) return wordsHelper(Math.floor(num / 1000)) + "Thousand " + wordsHelper(num % 1000);
//   if (num < 10000000) return wordsHelper(Math.floor(num / 100000)) + "Lakh " + wordsHelper(num % 100000);
//   return wordsHelper(Math.floor(num / 10000000)) + "Crore " + wordsHelper(num % 10000000);
// }
// function toWords(n) {
//   n = Math.round(n);
//   return (wordsHelper(n) + "Only").replace(/\s+/g, " ").trim();
// }

// function computeItems(items, taxType) {
//   return items.map((item) => {
//     const taxableValue = item.qty * item.rate;
//     const totalTax = +(taxableValue * (item.gstRate / 100)).toFixed(2);
//     const taxes =
//       taxType === "IGST"
//         ? { igst: totalTax }
//         : { cgst: +(totalTax / 2).toFixed(2), sgst: +(totalTax / 2).toFixed(2) };
//     return { ...item, taxableValue, totalTax, taxes, lineTotal: +(taxableValue + totalTax).toFixed(2) };
//   });
// }

// function computeTotals(computed) {
//   const subtotal = computed.reduce((s, i) => s + i.taxableValue, 0);
//   const totalTax = +computed.reduce((s, i) => s + i.totalTax, 0).toFixed(2);
//   const grandTotal = +(subtotal + totalTax).toFixed(2);
//   const taxBreakdown = {};
//   computed.forEach((item) => {
//     Object.entries(item.taxes).forEach(([k, v]) => {
//       taxBreakdown[k] = +((taxBreakdown[k] || 0) + v).toFixed(2);
//     });
//   });
//   const hsnMap = {};
//   computed.forEach((item) => {
//     const key = item.hsnCode;
//     if (!hsnMap[key]) hsnMap[key] = { hsnCode: key, gstRate: item.gstRate, taxableValue: 0, totalTax: 0, taxes: {} };
//     hsnMap[key].taxableValue += item.taxableValue;
//     hsnMap[key].totalTax = +(hsnMap[key].totalTax + item.totalTax).toFixed(2);
//     Object.entries(item.taxes).forEach(([k, v]) => {
//       hsnMap[key].taxes[k] = +((hsnMap[key].taxes[k] || 0) + v).toFixed(2);
//     });
//   });
//   return { subtotal, totalTax, grandTotal, taxBreakdown, hsnMap: Object.values(hsnMap) };
// }

// // ─── API Config ───────────────────────────────────────────────────────────────
// const API_URL = "/api/invoice"; // Replace with your actual endpoint
// //get the user form loclaStorage for the user
// const user=JSON.parse(localStorage.getItem("user"));
// // ─── Static Seller Info (always fixed, not from backend) ──────────────────────
// const SELLER = {
//   name: user?.cName,
//   logoText: "LAS",
//   address: user?.address,
//   gstin: user?.gstNo,
//   email:user?.email,
//   stateCode: "04",
//   bank: {
//     name: user?.accName,
//     bankName:user?.bankName,
//     accountNo: user?.accNo,
//     ifsc: user?.ifscCode,
//     branch: user?.branch,
//   },
// };

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function TaxInvoice({ invoiceId }) {
// const invoiceRef = useRef(null);
//   // ── Individual state for each data piece ──────────────────────────────────
//   const [invoice, setInvoice] = useState({
//     number:      "715",
//     date:        "20/02/2026",
//     orderRef:    "Verbal Order",
//     dispatchVia: "By Courier",
//     destination: "Baddi",
//   });

//   const [seller] = useState(SELLER); // seller is static, never changes from backend

//   const [buyer, setBuyer] = useState({
//     name:      "MEDICEF PHARMA",
//     address:   "Plot No. 28, 29 & 48, Phase-1 EPIP, Jharmajari,\nDistt: Solan, Baddi – 174103, Himachal Pradesh",
//     gstin:     "02AARFM0588N1ZR",
//     stateCode: "02",
//   });

//   const [items, setItems] = useState([
//     { description: "Toggle Valve",                     hsnCode: "8481",     qty: 1, unit: "NOS", rate: 1400, gstRate: 18 },
//     { description: "Mini Pressure Regulator w/ Screw", hsnCode: "84798999", qty: 1, unit: "NOS", rate: 2200, gstRate: 18 },
//     { description: "SS Standard Nut and Ferrules",     hsnCode: "7307",     qty: 1, unit: "NOS", rate: 450,  gstRate: 18 },
//     { description: "Repair & Service Charges",         hsnCode: "9983",     qty: 1, unit: "NOS", rate: 2500, gstRate: 18 },
//     { description: "Freight Charges",                  hsnCode: "9968",     qty: 1, unit: "NOS", rate: 300,  gstRate: 18 },
//   ]);

//   // ── Loading / error state ──────────────────────────────────────────────────
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState(null);

//   // ── Fetch from backend, map flat fields → individual states ───────────────
 
  


//   // ── Reconstruct combined data shape for rendering ─────────────────────────
//   const data = { invoice, seller, buyer, items };


//   // ── Error State ──
//   if (error) return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
//       <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow">
//         <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
//           </svg>
//         </div>
//         <p className="text-base font-bold text-slate-800 mb-1">Failed to load invoice</p>
//         <p className="text-sm text-red-500 font-mono mb-5">{error}</p>
//         <button
//           onClick={() => { setLoading(true); setError(null); }}
//           className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// const [freightPct, setFreightPct] = useState(0); // stores totals.fri from API

//   const taxType =
//     data.seller.stateCode !== data.buyer.stateCode ? "IGST" : "CGST+SGST";
//   const isIGST = taxType === "IGST";
//   const computed = computeItems(data.items, taxType);
//   const totals = computeTotals(computed);
//   const gstHalf = (computed[0]?.gstRate || 0) / 2;
// const location=useLocation()
// const [id,setId]=useState("");
// useEffect(()=>{
// setId(location.state?.id)
// },[location])
// useEffect(() => {
//   if (!id) return; // ⛔ don't call API until id exists

//   setLoading(true);
//   handlePreview();
// }, [id]);

// const [total,setTotal]=useState()
// //prevew
// const handlePreview=async()=>{
//   try{
//     const res= await api.get(`/invoice/getById/${id}`)
//     if(res.status!==200){
//      setError(`Failed to fetch invoice: ${res.status} ${res.statusText}`);
//       return;
//     }
//     const inv = res.data.invoice; 
//     console.log(inv)// 👈 important

//   // inv_num, inv_date, orderRef, dispatchVia, destination → invoice state
//   setInvoice({
//     number:      inv.inv_num,
//     date:        new Date(inv.inv_date).toLocaleDateString("en-GB"),
//     orderRef:    inv.orderRef,
//     dispatchVia: inv.dispatchVia,
//     destination: inv.destination,
//   });

//   // buy_name, buy_address, buy_gstno → buyer state
//   setBuyer({
//     name:      inv.buy_name,
//     address:   inv.buy_address,
//     gstin:     inv.buy_gstno,
//     stateCode: inv.buy_gstno?.substring(0, 2) ?? "00",
//   });

//   // items[] → items state
//   setItems(inv.items);
//   setFreightPct(inv?.total?.fri)
  

//   setLoading(false);


//   }catch(err){
//     console.log("Preview error:",err)
//   }
// }

// const handleDownloadPDF = async() => {
// try{
//   if(!invoiceRef.current) {
//     Swal.fire("Error", "Invoice content not found for PDF generation.", "error");
//   }
//   const fullHtml = `
// <!DOCTYPE html>
// <html>
// <head>
//   <script src="https://cdn.tailwindcss.com"></script>
// </head>
// <body>
//   ${invoiceRef.current.innerHTML}
// </body>
// </html>
// `;
//     const res = await api.post(
//       "/offer/pdf",
//       {
//         html: fullHtml,
//         fileName: `Invoice-${invoice.inv_num}.pdf`,
//       },
//       {
//         responseType: "blob", // 🔥 VERY IMPORTANT
//       }
//     );

//     const url = window.URL.createObjectURL(
//       new Blob([res.data], { type: "application/pdf" })
//     );

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `Invoice-${invoice.inv_num}.pdf`;
//     document.body.appendChild(a);
//     a.click();

//     a.remove();
//     window.URL.revokeObjectURL(url);

// }catch(err){
//   console.log("PDF Download error:", err.message)
// }
// }
//   return (
//     <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
//       {/* Action Bar */}
//       <Navbar/>
//       <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 print:hidden">
//         <div className="flex items-center gap-3">
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">Tax Invoice</h1>
//           {loading && (
//             <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
//               <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
//               Fetching live data…
//             </span>
//           )}
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => window.print()}
//             className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 shadow-sm transition"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
//             </svg>
//             Print
//           </button>
//           <button
//             onClick={() => handleDownloadPDF()}
//             className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow transition"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
//             </svg>
//             Download PDF
//           </button>
//         </div>
//       </div>

//       {/* Invoice Card */}
//       <div ref={invoiceRef} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
//         {/* Top stripe */}
//         <div className="h-1.5 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300" />

//         <div className="p-8 md:p-10 space-y-7">

//           {/* ── HEADER ── */}
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-7 border-b border-slate-100">
//             {/* Logo + Company */}
//             <div className="flex items-start gap-4">
//               <div className="w-14 h-14 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0 shadow">
//                 <span className="text-white font-black text-base tracking-wide">{data.seller.logoText}</span>
//               </div>
//               <div>
//                 <p className="text-lg font-extrabold text-slate-900 leading-tight">{data.seller.name}</p>
//                 <p className="text-xs text-slate-500 mt-1 leading-relaxed">
//                   {data.seller.address}<br />
//                   GSTIN: {data.seller.gstin} &nbsp;|&nbsp; PAN: {data.seller.pan}<br />
//                   {data.seller.email}
//                 </p>
//               </div>
//             </div>
//             {/* Invoice ID */}
//             <div className="text-right flex-shrink-0">
//               <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-1">Tax Invoice</p>
//               <p className="text-4xl font-black text-blue-800 font-mono leading-none mb-3">#{data.invoice.number}</p>
//               <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
//                 {data.invoice.date}
//               </span>
//             </div>
//           </div>

//           {/* ── BILL ROW ── */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {[
//               { label: "Bill From", party: data.seller, gstin: data.seller.gstin, state: data.seller.stateCode, addr: data.seller.address },
//               { label: "Bill To",   party: data.buyer,  gstin: data.buyer.gstin,  state: data.buyer.stateCode,  addr: data.buyer.address },
//             ].map(({ label, party, gstin, state, addr }) => (
//               <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
//                 <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">{label}</p>
//                 <p className="text-sm font-extrabold text-slate-900 mb-1">{party.name}</p>
//                 <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{addr}</p>
//                 <p className="text-xs font-mono text-slate-600 mt-2">GSTIN: {gstin} | State: {state}</p>
//               </div>
//             ))}
//           </div>

//           {/* ── META STRIP ── */}
//           <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-200 rounded-xl overflow-hidden divide-x divide-y sm:divide-y-0 divide-slate-200">
//             {[
//               { key: "Order Ref",      val: data.invoice.orderRef },
//               { key: "Dispatched Via", val: data.invoice.dispatchVia },
//               { key: "Destination",    val: data.invoice.destination },
//               { key: "Invoice Date",   val: data.invoice.date },
//             ].map(({ key, val }) => (
//               <div key={key} className="px-4 py-3">
//                 <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-400 mb-0.5">{key}</p>
//                 <p className="text-sm font-bold text-slate-800">{val}</p>
//               </div>
//             ))}
//           </div>

//           {/* ── ITEMS TABLE ── */}
//           <div className="border border-slate-200 rounded-xl overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm min-w-[600px]">
//                 <thead>
//                   <tr className="bg-slate-900 text-slate-300">
//                     <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider w-8">#</th>
//                     <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider">Description / HSN</th>
//                     <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider">Qty</th>
//                     <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Rate (₹)</th>
//                     <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider">Unit</th>
//                     <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Taxable (₹)</th>
//                     {isIGST ? (
//                       <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>IGST</th>
//                     ) : (
//                       <>
//                         <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>CGST</th>
//                         <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>SGST</th>
//                       </>
//                     )}
//                     <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Total (₹)</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {computed.map((item, idx) => (
//                     <tr key={idx} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-3 py-3 text-slate-400 text-xs">{idx + 1}</td>
//                       <td className="px-3 py-3">
//                         <p className="font-bold text-slate-900 text-xs">{item.description}</p>
//                         <p className="text-[11px] text-slate-400 font-mono">HSN: {item.hsnCode}</p>
//                       </td>
//                       <td className="px-3 py-3 text-center text-xs text-slate-600">{item.qty}</td>
//                       <td className="px-3 py-3 text-right text-xs font-mono text-slate-600">{fmtNum(item.rate)}</td>
//                       <td className="px-3 py-3 text-center text-xs text-slate-500">{item.unit}</td>
//                       <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-800">{fmtNum(item.taxableValue)}</td>
//                       {isIGST ? (
//                         <>
//                           <td className="px-2 py-3 text-right text-xs text-slate-500">{item.gstRate}%</td>
//                           <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.igst)}</td>
//                         </>
//                       ) : (
//                         <>
//                           <td className="px-2 py-3 text-right text-xs text-slate-500">{gstHalf}%</td>
//                           <td className="px-2 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.cgst)}</td>
//                           <td className="px-2 py-3 text-right text-xs text-slate-500">{gstHalf}%</td>
//                           <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.sgst)}</td>
//                         </>
//                       )}
//                       <td className="px-3 py-3 text-right text-xs font-mono font-extrabold text-slate-900">{fmtNum(item.lineTotal)}</td>
//                     </tr>
//                   ))}
//                   {/* Subtotal row */}
//                   <tr className="bg-slate-100 border-t-2 border-slate-300">
//                     <td colSpan={5} className="px-3 py-3 text-xs font-black text-slate-700 uppercase tracking-wider">Subtotal</td>
//                     <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.subtotal)}</td>
//                     {isIGST ? (
//                       <>
//                         <td />
//                         <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.igst || 0)}</td>
//                       </>
//                     ) : (
//                       <>
//                         <td />
//                         <td className="px-2 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.cgst || 0)}</td>
//                         <td />
//                         <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.sgst || 0)}</td>
//                       </>
//                     )}
//                     <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.grandTotal)}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* ── TOTALS PANEL ── */}
//           <div className="flex justify-end">
//             <div className="w-full sm:w-80 space-y-2">
//               <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//                 <span className="text-slate-400 font-medium">Subtotal (Taxable)</span>
//                 <span className="font-bold font-mono text-slate-800">{fmt(totals.subtotal)}</span>
//               </div>
//               {
//                 // const freightItem = data.items.find(i => i.description.toLowerCase().includes("freight"));
//                 // return freightItem ? (
//                   // <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//                   //   <span className="text-slate-400">Freight Charges</span>
//                   //   <span className="font-bold font-mono text-slate-800">{fmt(freightItem.rate * freightItem.qty)}</span>
//                   // </div>
//                 // ) : null;
                
//   <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//     <span className="text-slate-400">Freight Charges ({freightPct}%)</span>
//     <span className="font-bold font-mono text-slate-800">
//       {fmt(+(totals.subtotal * freightPct / 100).toFixed(2))}
//     </span>
//   </div>


//               }
//               {isIGST ? (
//                 <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//                   <span className="text-slate-400">IGST ({computed[0]?.gstRate || 0}%)</span>
//                   <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.igst || 0)}</span>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//                     <span className="text-slate-400">CGST ({gstHalf}%)</span>
//                     <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.cgst || 0)}</span>
//                   </div>
//                   <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
//                     <span className="text-slate-400">SGST ({gstHalf}%)</span>
//                     <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.sgst || 0)}</span>
//                   </div>
//                 </>
//               )}
//               <div className="flex justify-between items-center px-4 py-4 rounded-xl bg-blue-800 mt-2 shadow">
//                 <span className="text-white font-bold text-base">Grand Total</span>
//                 <span className="text-white font-black text-xl font-mono">{fmt(totals.grandTotal)}</span>
//               </div>
//             </div>
//           </div>

//           {/* ── HSN SUMMARY ── */}
//           <div className="border border-slate-200 rounded-xl overflow-hidden">
//             <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
//               <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">HSN / SAC Tax Summary</p>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs min-w-[480px]">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50">
//                     <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">HSN/SAC</th>
//                     <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Taxable (₹)</th>
//                     {isIGST ? (
//                       <>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">IGST Rate</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">IGST Amt</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Tax</th>
//                       </>
//                     ) : (
//                       <>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">CGST Rate</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">CGST (₹)</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">SGST Rate</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">SGST (₹)</th>
//                         <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Tax</th>
//                       </>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {totals.hsnMap.map((h) => (
//                     <tr key={h.hsnCode} className="hover:bg-slate-50">
//                       <td className="px-4 py-2.5 font-mono text-slate-600">{h.hsnCode}</td>
//                       <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxableValue)}</td>
//                       {isIGST ? (
//                         <>
//                           <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate}%</td>
//                           <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.igst || 0)}</td>
//                           <td className="px-4 py-2.5 text-right font-mono text-slate-700 font-bold">{fmtNum(h.totalTax)}</td>
//                         </>
//                       ) : (
//                         <>
//                           <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate / 2}%</td>
//                           <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.cgst || 0)}</td>
//                           <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate / 2}%</td>
//                           <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.sgst || 0)}</td>
//                           <td className="px-4 py-2.5 text-right font-mono text-slate-700 font-bold">{fmtNum(h.totalTax)}</td>
//                         </>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="bg-slate-100 border-t-2 border-slate-300">
//                     <td className="px-4 py-2.5 font-black text-slate-800 text-xs">Total</td>
//                     <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.subtotal)}</td>
//                     {isIGST ? (
//                       <>
//                         <td />
//                         <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.igst || 0)}</td>
//                         <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.totalTax)}</td>
//                       </>
//                     ) : (
//                       <>
//                         <td />
//                         <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.cgst || 0)}</td>
//                         <td />
//                         <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.sgst || 0)}</td>
//                         <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.totalTax)}</td>
//                       </>
//                     )}
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>

//           {/* ── AMOUNT IN WORDS ── */}
//           <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 space-y-1">
//             <p className="text-xs text-slate-600 leading-relaxed">
//               <span className="font-extrabold text-slate-900">Amount Chargeable (in words): </span>
//               <span className="italic">Indian Rupees {toWords(totals.grandTotal)}</span>
//             </p>
//             <p className="text-xs text-slate-600 leading-relaxed">
//               <span className="font-extrabold text-slate-900">Tax Amount (in words): </span>
//               <span className="italic">Indian Rupees {toWords(totals.totalTax)}</span>
//             </p>
//           </div>

//           {/* ── BANK + DECLARATION ── */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
//               <p className="text-[10px] font-black uppercase tracking-[2px] text-blue-600 mb-3">Bank Details</p>
//               <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
//                 <p><span className="font-bold">A/c Name:</span> {data.seller.bank.name}</p>
//                 <p><span className="font-bold">Bank:</span> {data.seller.bank.bankName}</p>
//                 <p>
//                   <span className="font-bold">A/c No.:</span>{" "}
//                   <code className="bg-white border border-blue-200 rounded px-1.5 py-0.5 font-mono text-blue-700">{data.seller.bank.accountNo}</code>
//                 </p>
//                 <p>
//                   <span className="font-bold">IFSC:</span>{" "}
//                   <code className="bg-white border border-blue-200 rounded px-1.5 py-0.5 font-mono text-blue-700">{data.seller.bank.ifsc}</code>
//                 </p>
//                 <p><span className="font-bold">Branch:</span> {data.seller.bank.branch}</p>
//               </div>
//             </div>
//             <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">Declaration</p>
//                 <p className="text-xs text-slate-500 leading-relaxed">
//                   We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
//                 </p>
//               </div>
//               <div className="mt-6 pt-4 border-t border-slate-200 text-right">
//                 <p className="text-xs font-extrabold text-slate-900">For {data.seller.name}</p>
//                 <p className="text-[11px] text-slate-400 mt-0.5">Authorised Signatory</p>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Footer */}
//         <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
//           This is a Computer Generated Invoice — E. &amp; O.E.
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from "react";
import api from "../axios/axios";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Swal from "sweetalert2";
import { useNavigate }  from "react-router-dom";

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  "₹" +
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtNum = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function wordsHelper(num) {
  if (num === 0) return "";
  if (num < 20) return ONES[num] + " ";
  if (num < 100) return TENS[Math.floor(num / 10)] + (num % 10 ? " " + ONES[num % 10] : "") + " ";
  if (num < 1000) return ONES[Math.floor(num / 100)] + " Hundred " + wordsHelper(num % 100);
  if (num < 100000) return wordsHelper(Math.floor(num / 1000)) + "Thousand " + wordsHelper(num % 1000);
  if (num < 10000000) return wordsHelper(Math.floor(num / 100000)) + "Lakh " + wordsHelper(num % 100000);
  return wordsHelper(Math.floor(num / 10000000)) + "Crore " + wordsHelper(num % 10000000);
}

function toWords(n) {
  n = Math.round(n || 0);
  if (n === 0) return "Zero Only";
  return (wordsHelper(n) + "Only").replace(/\s+/g, " ").trim();
}

function computeItems(items, taxType) {
  return (items || []).map((item) => {
    const taxableValue = (item.qty || 0) * (item.rate || 0);
    const totalTax = +(taxableValue * ((item.gstRate || 0) / 100)).toFixed(2);
    const taxes =
      taxType === "IGST"
        ? { igst: totalTax }
        : { cgst: +(totalTax / 2).toFixed(2), sgst: +(totalTax / 2).toFixed(2) };
    return {
      ...item,
      taxableValue,
      totalTax,
      taxes,
      lineTotal: +(taxableValue + totalTax).toFixed(2),
    };
  });
}

function computeTotals(computed) {
  const subtotal = computed.reduce((s, i) => s + i.taxableValue, 0);
  const totalTax = +computed.reduce((s, i) => s + i.totalTax, 0).toFixed(2);
  const grandTotal = +(subtotal + totalTax).toFixed(2);
  const taxBreakdown = {};
  computed.forEach((item) => {
    Object.entries(item.taxes).forEach(([k, v]) => {
      taxBreakdown[k] = +((taxBreakdown[k] || 0) + v).toFixed(2);
    });
  });
  const hsnMap = {};
  computed.forEach((item) => {
    const key = item.hsnCode;
    if (!hsnMap[key])
      hsnMap[key] = { hsnCode: key, gstRate: item.gstRate, taxableValue: 0, totalTax: 0, taxes: {} };
    hsnMap[key].taxableValue += item.taxableValue;
    hsnMap[key].totalTax = +(hsnMap[key].totalTax + item.totalTax).toFixed(2);
    Object.entries(item.taxes).forEach(([k, v]) => {
      hsnMap[key].taxes[k] = +((hsnMap[key].taxes[k] || 0) + v).toFixed(2);
    });
  });
  return { subtotal, totalTax, grandTotal, taxBreakdown, hsnMap: Object.values(hsnMap) };
}

// ─── Static Seller Info (from localStorage) ───────────────────────────────────
const user = JSON.parse(localStorage.getItem("user") || "{}");
const SELLER = {
  name:      user?.cName      || "Your Company Name",
  logoText:  "LAS",
  address:   user?.address    || "",
  gstin:     user?.gstNo      || "",
  pan:       user?.pan        || "",
  email:     user?.email      || "",
  stateCode: user?.stateCode  || "04",
  bank: {
    name:      user?.accName   || "",
    bankName:  user?.bankName  || "",
    accountNo: user?.accNo     || "",
    ifsc:      user?.ifscCode  || "",
    branch:    user?.branch    || "",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PreviewInvoice() {
  const invoiceRef = useRef(null);
  const location   = useLocation();

  // ── State ──────────────────────────────────────────────────────────────────
  const [id,       setId]       = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const [invoice, setInvoice] = useState({
    number:      "",
    date:        "",
    orderRef:    "",
    dispatchVia: "",
    destination: "",
  });

  const [buyer, setBuyer] = useState({
    name:      "",
    address:   "",
    gstin:     "",
    stateCode: "00",
  });

  const [items,       setItems]       = useState([]);
  // freightPct stores totals.fri from API (freight as % of subtotal)
  const [freightPct,  setFreightPct]  = useState(0);
  // grandTotalOverride stores the exact total from the API (includes freight)
  const [grandTotalOverride, setGrandTotalOverride] = useState(null);

  const seller = SELLER;

  // ── Read id from route state ───────────────────────────────────────────────
  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
  }, [location]);

  // ── Fetch invoice when id is ready ────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    handlePreview();
  }, [id]);
const navigate=useNavigate()
  // ── API Call ──────────────────────────────────────────────────────────────
  const handlePreview = async () => {
    try {
      const res = await api.get(`/invoice/getById/${id}`);
      if (res.status !== 200) {
        Swal.fire({
          title:"Invoice Error",
          icon:"error",
          text:"Pl login ,unautherized access !!"
        })
        navigate('/login')
        return;
      }
      const inv = res.data.invoice;

      setInvoice({
        number:      inv.inv_num      || "",
        date:        new Date(inv.inv_date).toLocaleDateString("en-GB"),
        orderRef:    inv.orderRef     || "",
        dispatchVia: inv.dispatchVia  || "",
        destination: inv.destination  || "",
      });

      setBuyer({
        name:      inv.buy_name    || "",
        address:   inv.buy_address || "",
        gstin:     inv.buy_gstno   || "",
        stateCode: inv.buy_gstno?.substring(0, 2) ?? "00",
      });

      setItems(inv.items || []);

      // ── Freight: API stores it as totals.fri (percentage) ──
      setFreightPct(inv.totals?.fri ?? 0);

      // ── Use the API's exact grand total (already includes freight) ──
      setGrandTotalOverride(inv.totals?.total ?? null);

    } catch (err) {
      console.error("Preview error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── PDF Download ──────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    try {
      if (!invoiceRef.current) {
        Swal.fire("Error", "Invoice content not found for PDF generation.", "error");
        return;
      }
      const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body>
  ${invoiceRef.current.innerHTML}
</body>
</html>`;

      const res = await api.post(
        "/offer/pdf",
        { html: fullHtml, fileName: `Invoice-${invoice.number}.pdf` },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a   = document.createElement("a");
      a.href     = url;
      a.download = `Invoice-${invoice.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Download error:", err.message);
      Swal.fire("Error", "Failed to generate PDF. Please try again.", "error");
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const taxType  = seller.stateCode !== buyer.stateCode ? "IGST" : "CGST+SGST";
  const isIGST   = taxType === "IGST";
  const computed = computeItems(items, taxType);
  const totals   = computeTotals(computed);
  const gstHalf  = (computed[0]?.gstRate || 0) / 2;

  // Freight amount derived from percentage
  const freightAmt = freightPct > 0
    ? +(totals.subtotal * freightPct / 100).toFixed(2)
    : 0;

  // Final grand total — prefer the API value, fall back to computed
  const finalGrandTotal = grandTotalOverride ?? +(totals.grandTotal + freightAmt).toFixed(2);

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <p className="text-base font-bold text-slate-800 mb-1">Failed to load invoice</p>
        <p className="text-sm text-red-500 font-mono mb-5">{error}</p>
        <button
          onClick={() => { setError(null); if (id) { setLoading(true); handlePreview(); } }}
          className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans">
      <Navbar />

      {/* Action Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-4 print:hidden">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Tax Invoice</h1>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
              Fetching live data…
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 shadow-sm transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 shadow transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div ref={invoiceRef} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Top stripe */}
        <div className="h-1.5 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-300" />

        <div className="p-8 md:p-10 space-y-7">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-7 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-20 h-18 rounded-xl bg-blue-800 flex items-center justify-center flex-shrink-0 shadow">
                <img src={user?.letterpad}/>
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">{seller.name}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {seller.address}<br />
                  GSTIN: {seller.gstin} &nbsp;|&nbsp; PAN: {seller.pan}<br />
                  {seller.email}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-1">Tax Invoice</p>
              <p className="text-4xl font-black text-blue-800 font-mono leading-none mb-3">#{invoice.number}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
                {invoice.date}
              </span>
            </div>
          </div>

          {/* ── BILL ROW ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Bill From", name: seller.name, gstin: seller.gstin, state: seller.stateCode, addr: seller.address },
              { label: "Bill To",   name: buyer.name,  gstin: buyer.gstin,  state: buyer.stateCode,  addr: buyer.address  },
            ].map(({ label, name, gstin, state, addr }) => (
              <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">{label}</p>
                <p className="text-sm font-extrabold text-slate-900 mb-1">{name}</p>
                <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{addr}</p>
                <p className="text-xs font-mono text-slate-600 mt-2">GSTIN: {gstin} | State: {state}</p>
              </div>
            ))}
          </div>

          {/* ── META STRIP ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-slate-200 rounded-xl overflow-hidden divide-x divide-y sm:divide-y-0 divide-slate-200">
            {[
              { key: "Order Ref",      val: invoice.orderRef    },
              { key: "Dispatched Via", val: invoice.dispatchVia },
              { key: "Destination",    val: invoice.destination },
              { key: "Invoice Date",   val: invoice.date        },
            ].map(({ key, val }) => (
              <div key={key} className="px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-400 mb-0.5">{key}</p>
                <p className="text-sm font-bold text-slate-800">{val}</p>
              </div>
            ))}
          </div>

          {/* ── ITEMS TABLE ── */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-slate-900 text-slate-300">
                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider w-8">#</th>
                    <th className="px-3 py-3 text-left text-[10px] font-bold uppercase tracking-wider">Description / HSN</th>
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider">Qty</th>
                    <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Rate (₹)</th>
                    <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider">Unit</th>
                    <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Taxable (₹)</th>
                    {isIGST ? (
                      <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>IGST</th>
                    ) : (
                      <>
                        <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>CGST</th>
                        <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider" colSpan={2}>SGST</th>
                      </>
                    )}
                    <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {computed.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3 text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <p className="font-bold text-slate-900 text-xs">{item.description}</p>
                        <p className="text-[11px] text-slate-400 font-mono">HSN: {item.hsnCode}</p>
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-slate-600">{item.qty}</td>
                      <td className="px-3 py-3 text-right text-xs font-mono text-slate-600">{fmtNum(item.rate)}</td>
                      <td className="px-3 py-3 text-center text-xs text-slate-500">{item.unit}</td>
                      <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-800">{fmtNum(item.taxableValue)}</td>
                      {isIGST ? (
                        <>
                          <td className="px-2 py-3 text-right text-xs text-slate-500">{item.gstRate}%</td>
                          <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.igst)}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-3 text-right text-xs text-slate-500">{gstHalf}%</td>
                          <td className="px-2 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.cgst)}</td>
                          <td className="px-2 py-3 text-right text-xs text-slate-500">{gstHalf}%</td>
                          <td className="px-3 py-3 text-right text-xs font-mono font-bold text-slate-700">{fmtNum(item.taxes.sgst)}</td>
                        </>
                      )}
                      <td className="px-3 py-3 text-right text-xs font-mono font-extrabold text-slate-900">{fmtNum(item.lineTotal)}</td>
                    </tr>
                  ))}
                  {/* Subtotal row */}
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td colSpan={5} className="px-3 py-3 text-xs font-black text-slate-700 uppercase tracking-wider">Subtotal</td>
                    <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.subtotal)}</td>
                    {isIGST ? (
                      <>
                        <td />
                        <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.igst || 0)}</td>
                      </>
                    ) : (
                      <>
                        <td />
                        <td className="px-2 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.cgst || 0)}</td>
                        <td />
                        <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.sgst || 0)}</td>
                      </>
                    )}
                    <td className="px-3 py-3 text-right text-xs font-mono font-black text-slate-900">{fmtNum(totals.grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── TOTALS PANEL ── */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-2">

              {/* Subtotal */}
              <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                <span className="text-slate-400 font-medium">Subtotal (Taxable)</span>
                <span className="font-bold font-mono text-slate-800">{fmt(totals.subtotal)}</span>
              </div>

              {/* ── Freight Charges (only shown if freightPct > 0) ── */}
              {freightPct > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-400 font-medium">
                    Freight Charges ({freightPct}%)
                  </span>
                  <span className="font-bold font-mono text-slate-800">{fmt(freightAmt)}</span>
                </div>
              )}

              {/* Tax rows */}
              {isIGST ? (
                <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                  <span className="text-slate-400">IGST ({computed[0]?.gstRate || 0}%)</span>
                  <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.igst || 0)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-400">CGST ({gstHalf}%)</span>
                    <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.cgst || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-400">SGST ({gstHalf}%)</span>
                    <span className="font-bold font-mono text-slate-800">{fmt(totals.taxBreakdown.sgst || 0)}</span>
                  </div>
                </>
              )}

              {/* Grand Total — uses API value which already includes freight */}
              <div className="flex justify-between items-center px-4 py-4 rounded-xl bg-blue-800 mt-2 shadow">
                <span className="text-white font-bold text-base">Grand Total</span>
                <span className="text-white font-black text-xl font-mono">{fmt(finalGrandTotal)}</span>
              </div>
            </div>
          </div>

          {/* ── HSN SUMMARY ── */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">HSN / SAC Tax Summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">HSN/SAC</th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Taxable (₹)</th>
                    {isIGST ? (
                      <>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">IGST Rate</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">IGST Amt</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Tax</th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">CGST Rate</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">CGST (₹)</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">SGST Rate</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">SGST (₹)</th>
                        <th className="px-4 py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Tax</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {totals.hsnMap.map((h) => (
                    <tr key={h.hsnCode} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono text-slate-600">{h.hsnCode}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxableValue)}</td>
                      {isIGST ? (
                        <>
                          <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate}%</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.igst || 0)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-700 font-bold">{fmtNum(h.totalTax)}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate / 2}%</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.cgst || 0)}</td>
                          <td className="px-4 py-2.5 text-right text-slate-500">{h.gstRate / 2}%</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-600">{fmtNum(h.taxes.sgst || 0)}</td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-700 font-bold">{fmtNum(h.totalTax)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td className="px-4 py-2.5 font-black text-slate-800 text-xs">Total</td>
                    <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.subtotal)}</td>
                    {isIGST ? (
                      <>
                        <td />
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.igst || 0)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.totalTax)}</td>
                      </>
                    ) : (
                      <>
                        <td />
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.cgst || 0)}</td>
                        <td />
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.taxBreakdown.sgst || 0)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-black text-slate-900">{fmtNum(totals.totalTax)}</td>
                      </>
                    )}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── AMOUNT IN WORDS ── */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 space-y-1">
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-extrabold text-slate-900">Amount Chargeable (in words): </span>
              <span className="italic">Indian Rupees {toWords(finalGrandTotal)}</span>
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-extrabold text-slate-900">Tax Amount (in words): </span>
              <span className="italic">Indian Rupees {toWords(totals.totalTax)}</span>
            </p>
          </div>

          {/* ── BANK + DECLARATION ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-[10px] font-black uppercase tracking-[2px] text-blue-600 mb-3">Bank Details</p>
              <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
                <p><span className="font-bold">A/c Name:</span> {seller.bank.name}</p>
                <p><span className="font-bold">Bank:</span> {seller.bank.bankName}</p>
                <p>
                  <span className="font-bold">A/c No.:</span>{" "}
                  <code className="bg-white border border-blue-200 rounded px-1.5 py-0.5 font-mono text-blue-700">{seller.bank.accountNo}</code>
                </p>
                <p>
                  <span className="font-bold">IFSC:</span>{" "}
                  <code className="bg-white border border-blue-200 rounded px-1.5 py-0.5 font-mono text-blue-700">{seller.bank.ifsc}</code>
                </p>
                <p><span className="font-bold">Branch:</span> {seller.bank.branch}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400 mb-2">Declaration</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  We declare that this invoice shows the actual price of the goods described
                  and that all particulars are true and correct.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 text-right">
                <p className="text-xs font-extrabold text-slate-900">For {seller.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Authorised Signatory</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 font-mono">
          This is a Computer Generated Invoice — E. &amp; O.E.
        </div>
      </div>
    </div>
  );
}