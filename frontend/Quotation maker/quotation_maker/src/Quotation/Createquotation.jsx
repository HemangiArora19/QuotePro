// import React,{useState,useEffect} from 'react'
// import { useNavigate } from "react-router";
// import { useAuth } from '../context/Auth/authContext';
// import Swal from "sweetalert2";
// import { useOffer } from '../context/Offer/offerContext';
// const Createquotation = () => {
//    let navigate = useNavigate();
//   const [clientName, setClientName] = useState('');
//   const [clientEmail, setClientEmail] = useState('');
//   const [clientAddress, setClientAddress] = useState('');
//   const [quoteNumber, setQuoteNumber] = useState('QT-2025-001');
//   const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0]);
//   const [notes, setNotes] = useState('');
//   const [taxRate, setTaxRate] = useState(0);
//   const [items, setItems] = useState([
//     { desc: '', qty: 1, rate: 0, total: 0 }
//   ]);
//   const [showPreview, setShowPreview] = useState(false);

//   const calculateItemTotal = (qty, rate) => {
//     return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;

//     if (field === 'qty' || field === 'rate') {
//       newItems[index].total = calculateItemTotal(newItems[index].qty, newItems[index].rate);
//     }

//     setItems(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { desc: '', qty: 1, rate: 0, total: 0 }]);
//   };

//   const removeItem = (index) => {
//     if (items.length > 1) {
//       setItems(items.filter((_, i) => i !== index));
//     } else {
//       alert('At least one item is required');
//     }
//   };

//   const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
//   const taxAmount = (subtotal * taxRate) / 100;
//   const total = subtotal + taxAmount;

//   const handlePreview = () => {
//     setShowPreview(true);
//     setTimeout(() => {
//       document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };
// const {user}= useAuth();
// const{createOffer}=useOffer();
// // handle form submission
// const handleSubmit=async()=>{
//   try{
//     const token= sessionStorage.getItem("token");
//     if(!token){
//       navigate('/login')
//       return;
//     }
//     const response= await createOffer(
//       clientName,
//       clientEmail,
//       clientAddress,
//       quoteNumber,
//       quoteDate,
//       items,
//       subtotal,
//       taxRate,
//       taxAmount,
//       notes
//     );
//     Swal.fire({
//       icon:"success",
//       title:"Success",
//       text:"Quotation Created Successfully"
//     })
//     navigate(`/view_quote/${response._id}`);
// }catch (err) {
//   Swal.fire({
//     icon: "error",
//     title: "Error",
//     text: err?.response?.data?.message || err.message || "Failed to create quotation",
//   });
// }
// }
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Navigation */}
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-6xl mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">Q</span>
//               </div>
//               <span className="text-2xl font-bold text-gray-800">QuotePro</span>
//             </div>
//             <button className="px-6 py-2 text-gray-600 hover:text-gray-800 transition font-medium" onClick={()=>{navigate('/')}}>
//               ← Back
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-6 py-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Quotation</h1>
//           <p className="text-gray-600">Fill in the details to generate your professional quotation</p>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">

//           {/* Client Information */}
//           <div className="mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
//               Client Information
//             </h2>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
//                 <input
//                   type="text"
//                   value={clientName}
//                   onChange={(e) => setClientName(e.target.value)}
//                   placeholder="Client Name"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
//                 <input
//                   type="email"
//                   value={clientEmail}
//                   onChange={(e) => setClientEmail(e.target.value)}
//                   placeholder="client@example.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Client Address</label>
//                 <input
//                   type="text"
//                   value={clientAddress}
//                   onChange={(e) => setClientAddress(e.target.value)}
//                   placeholder="Client Address"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Number *</label>
//                 <input
//                   type="text"
//                   value={quoteNumber}
//                   onChange={(e) => setQuoteNumber(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
//                 <input
//                   type="date"
//                   value={quoteDate}
//                   onChange={(e) => setQuoteDate(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Items/Services */}
//           <div className="mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
//               Items/Services
//             </h2>

//             <div className="hidden md:grid grid-cols-12 gap-3 mb-3 text-sm font-semibold text-gray-600 px-2">
//               <div className="col-span-5">Description</div>
//               <div className="col-span-2 text-center">Quantity</div>
//               <div className="col-span-2 text-center">Rate ($)</div>
//               <div className="col-span-2 text-center">Amount ($)</div>
//               <div className="col-span-1"></div>
//             </div>

//             {items.map((item, index) => (
//               <div key={index} className="grid grid-cols-12 gap-3 mb-4 items-end">
//                 <div className="col-span-12 md:col-span-5">
//                   <label className="block md:hidden text-sm font-medium text-gray-700 mb-2">Description</label>
//                   <input
//                     type="text"
//                     value={item.desc}
//                     onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
//                     placeholder="Enter service or product"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>
//                 <div className="col-span-4 md:col-span-2">
//                   <label className="block md:hidden text-sm font-medium text-gray-700 mb-2">Qty</label>
//                   <input
//                     type="number"
//                     value={item.qty}
//                     onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
//                     min="1"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>
//                 <div className="col-span-4 md:col-span-2">
//                   <label className="block md:hidden text-sm font-medium text-gray-700 mb-2">Rate</label>
//                   <input
//                     type="number"
//                     value={item.rate}
//                     onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
//                     min="0"
//                     step="0.01"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>
//                 <div className="col-span-3 md:col-span-2">
//                   <label className="block md:hidden text-sm font-medium text-gray-700 mb-2">Amount</label>
//                   <input
//                     type="text"
//                     value={item.total.toFixed(2)}
//                     readOnly
//                     className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold"
//                   />
//                 </div>
//                 <div className="col-span-1 md:col-span-1">
//                   <button
//                     onClick={() => removeItem(index)}
//                     className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={addItem}
//               className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-md"
//             >
//               + Add Another Item
//             </button>
//           </div>

//           {/* Calculations */}
//           <div className="mb-8">
//             <div className="flex justify-end">
//               <div className="w-full md:w-96 space-y-4">
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span className="font-medium">Subtotal:</span>
//                   <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <label className="font-medium text-gray-700">Tax Rate (%):</label>
//                   <input
//                     type="number"
//                     value={taxRate}
//                     onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </div>
//                 <div className="flex justify-between items-center text-gray-700">
//                   <span className="font-medium">Tax Amount:</span>
//                   <span className="text-xl font-bold">${taxAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
//                   <span className="text-xl font-bold text-gray-800">Total:</span>
//                   <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Notes/Terms */}
//           <div className="mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">4</span>
//               Notes & Terms
//             </h2>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               rows="4"
//               placeholder="Payment terms, delivery details, validity period, etc."
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handlePreview}
//               className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg"
//             >
//               Preview Quotation
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg"
//             >
//               Create
//             </button>
//           </div>
//         </div>

//         {/* Preview Section */}
//         {showPreview && (
//           <div id="preview" className="bg-white rounded-2xl shadow-xl p-8 mt-8">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
//               <button
//                 onClick={() => setShowPreview(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
//               >
//                 Close ×
//               </button>
//             </div>
//             <div className="border-t pt-6">
//               <div className="max-w-4xl mx-auto">
//                 <div className="border-b-4 border-blue-600 pb-6 mb-6">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h1 className="text-3xl font-bold text-gray-800 mb-2">{companyName || 'Your Company'}</h1>
//                       <div className="text-gray-600 text-sm">
//                         {companyEmail && <p>{companyEmail}</p>}
//                         {companyPhone && <p>{companyPhone}</p>}
//                         {companyAddress && <p>{companyAddress}</p>}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold mb-2">QUOTATION</div>
//                       <p className="text-sm text-gray-600"><span className="font-semibold">Quote #:</span> {quoteNumber}</p>
//                       <p className="text-sm text-gray-600"><span className="font-semibold">Date:</span> {quoteDate}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-6">
//                   <h3 className="font-semibold text-gray-700 text-sm mb-1">Bill To:</h3>
//                   <p className="font-bold text-gray-800 text-lg">{clientName || 'Client Name'}</p>
//                   {clientEmail && <p className="text-gray-600 text-sm">{clientEmail}</p>}
//                 </div>

//                 <table className="w-full mb-6">
//                   <thead className="bg-gray-800 text-white">
//                     <tr>
//                       <th className="py-3 px-2 text-left">Description</th>
//                       <th className="py-3 px-2 text-center">Qty</th>
//                       <th className="py-3 px-2 text-right">Rate</th>
//                       <th className="py-3 px-2 text-right">Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {items.filter(item => item.desc).length > 0 ? (
//                       items.filter(item => item.desc).map((item, index) => (
//                         <tr key={index} className="border-b">
//                           <td className="py-3 px-2">{item.desc}</td>
//                           <td className="py-3 px-2 text-center">{item.qty}</td>
//                           <td className="py-3 px-2 text-right">${parseFloat(item.rate).toFixed(2)}</td>
//                           <td className="py-3 px-2 text-right font-bold">${parseFloat(item.total).toFixed(2)}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="4" className="py-4 text-center text-gray-500">No items added</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>

//                 <div className="flex justify-end mb-6">
//                   <div className="w-80">
//                     <div className="flex justify-between mb-2 text-gray-700">
//                       <span>Subtotal:</span>
//                       <span className="font-bold">${subtotal.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between mb-2 text-gray-700">
//                       <span>Tax ({taxRate}%):</span>
//                       <span className="font-bold">${taxAmount.toFixed(2)}</span>
//                     </div>
//                     <div className="flex justify-between text-2xl font-bold text-gray-800 pt-3 border-t-2 border-gray-800">
//                       <span>Total:</span>
//                       <span className="text-blue-600">${total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {notes && (
//                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                     <h3 className="font-bold text-gray-800 mb-2">Notes & Terms:</h3>
//                     <p className="text-gray-700 whitespace-pre-line text-sm">{notes}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Createquotation

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router";
import { useAuth } from "../context/Auth/authContext";
import { useOffer } from "../context/Offer/offerContext";
export default function CreateQuotation() {
  const { user } = useAuth();
  const location = useLocation();
  const[e,setE]=useState(false)
  const[id,setId]=useState(null);
 
  const { createOffer,editOffer } = useOffer();
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [kindAttention, setKindAttention] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("QT-2025-001");
  const [quoteDate, setQuoteDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [notes, setNotes] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState([
    { desc: "", qty: 1, rate: 0, discount: 0, total: 0, delievery: "" },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [subject, setSubject] = useState("");

  const calculateItemTotal = (qty, rate, discount) => {
    const subtotal = (parseInt(qty) || 0) * (parseFloat(rate) || 0);
    const discountAmount = (subtotal * parseFloat(discount) || 0) / 100;
    return Math.max(0, subtotal - discountAmount);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    if (field === "qty") {
      newItems[index][field] = parseInt(value) || 0;
    } else if (field === "rate" || field === "discount") {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }

    if (field === "qty" || field === "rate" || field === "discount") {
      newItems[index].total = calculateItemTotal(
        newItems[index].qty,
        newItems[index].rate,
        newItems[index].discount,
      );
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { desc: "", qty: 1, rate: 0, discount: 0, total: 0, delievery: "" },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      alert("At least one item is required");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0,
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
console.log(id,e)
  const handlePreview = () => {
    setShowPreview(true);
    setTimeout(() => {
      document
        .getElementById("preview")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
   useEffect(()=>{
    if(location?.state?.quotation){
      setE(true);
      setId(location.state.quotation._id)
      setClientName(location.state.quotation.clientName);
      setClientEmail(location.state.quotation.clientEmail);
      setClientAddress(location.state.quotation.clientAddress);
      setKindAttention(location.state.quotation.kindAttention);
      setQuoteNumber(location.state.quotation.quoteNumber);
      setSubject(location.state.quotation.subject);
      setQuoteDate(location.state.quotation.quoteDate.split("T")[0]);
     
      setNotes(location.state.quotation.notes);
      setTaxRate(location.state.quotation.taxRate);
      setItems(location.state.quotation.items || []);
      setE(true);
    }

  },[location])
const handleSubmit=async()=>{
  //how wdotion will hpapned indise ths form it self
    // API call would go here
    try {
      if (!clientName) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter client name",
        });
        return;
      }
      if (items.filter((item) => item.desc).length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please add at least one item",
        });
        return;
      }
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await createOffer(
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
        notes,
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quotation Created Successfully",
      });
      navigate("/view_quote");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to create quotation",
      });
    }

}
  const handleEdit = async () => {
    // Validation

    try {
      if (!clientName) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please enter client name",
        });
        return;
      }
      if (items.filter((item) => item.desc).length === 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please add at least one item",
        });
        return;
      }
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      await editOffer(
        id,
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
        notes,
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Quotation Edited Successfully",
      });
      navigate("/view_quote");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message ||
          err.message ||
          "Failed to edit quotation",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">QuotePro</span>
            </div>
            <button className="px-6 py-2 text-gray-600 hover:text-gray-800 transition font-medium">
              ← Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
           {e?"Edit Quotation":"Create Quotation"}
          </h1>
          <p className="text-gray-600">
           { e?"Fill in the details to edit your professional quotation":"Fill in the details to generate your professional quotation"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Client Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                1
              </span>
              Client Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Address
                </label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Client Address"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg
             focus:ring-2 focus:ring-blue-500 focus:border-transparent
             transition whitespace-pre-line text-sm resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quotation Number *
                </label>
                <input
                  type="text"
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={quoteDate}
                  onChange={(e) => setQuoteDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kind Attention *
                </label>
                <input
                  type="text"
                  value={kindAttention}
                  onChange={(e) => setKindAttention(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Items/Services */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                2
              </span>
              Items/Services
            </h2>

            {/* Items Header */}
            <div className="hidden lg:grid grid-cols-12 gap-3 mb-3 text-sm font-semibold text-gray-600 px-2">
              <div className="col-span-4">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Rate (₹)</div>
              <div className="col-span-2 text-center">Discount (₹)</div>
              <div className="col-span-1 text-center">Amount (₹)</div>
              <div className="col-span-1 text-center">Delievery</div>
              <div className="col-span-1 "></div>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mb-4 items-end"
              >
                <div className="col-span-12 lg:col-span-4">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) =>
                      handleItemChange(index, "desc", e.target.value)
                    }
                    placeholder="Enter service or product"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="col-span-3 lg:col-span-2">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Qty
                  </label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                    min="1"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="col-span-3 lg:col-span-2">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Rate
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="col-span-3 lg:col-span-2">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, "discount", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={`₹${item.total.toFixed(2)}`}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className="block lg:hidden text-sm font-medium text-gray-700 mb-2">
                    Delievery
                  </label>
                  <input
                    type="text"
                    value={item.delievery}
                    onChange={(e) =>
                      handleItemChange(index, "delievery", e.target.value)
                    }
                    placeholder="Delievery details"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="col-span-1 lg:col-span-1">
                  <button
                    onClick={() => removeItem(index)}
                    className="w-full px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold shadow-md"
            >
              + Add Another Item
            </button>
          </div>

          {/* Calculations */}
          <div className="mb-8">
            <div className="flex justify-end">
              <div className="w-full md:w-96 space-y-4">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal:</span>
                  <span className="text-xl font-bold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <label className="font-medium text-gray-700">
                    Tax Rate (%):
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) =>
                      setTaxRate(parseFloat(e.target.value) || 0)
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Tax Amount:</span>
                  <span className="text-xl font-bold">
                    ₹{taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                  <span className="text-xl font-bold text-gray-800">
                    Total:
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes/Terms */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                3
              </span>
              Notes & Terms
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Payment terms, delivery details, validity period, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePreview}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold text-lg shadow-lg"
            >
              Preview Quotation
            </button>
            {e?(<button
              onClick={handleEdit}
              className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg"
            >
             Edit Quotation
            </button>)
              :
              (<button
              onClick={handleSubmit}
              className="flex-1 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-bold text-lg shadow-lg"
            >
              Create Quotation
            </button>)
            }
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div id="preview" className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              >
                Close ×
              </button>
            </div>
            <div className="border-t pt-6">
              <div className="max-w-4xl mx-auto">
                <div className="border-b-4 border-blue-600 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Your Company Name
                      </h1>
                      <div className="text-gray-600 text-sm">
                        <p>company@example.com</p>
                        <p>+91 12345 67890</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold mb-2">
                        QUOTATION
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Quote #:</span>{" "}
                        {quoteNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Date:</span> {quoteDate}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 text-sm mb-1">
                    Bill To:
                  </h3>
                  <p className="font-bold text-gray-800 text-lg">
                    {clientName || "Client Name"}
                  </p>
                  {clientEmail && (
                    <p className="text-gray-600 text-sm">{clientEmail}</p>
                  )}
                  {clientAddress && (
                    <p className="text-gray-600 text-sm">{clientAddress}</p>
                  )}
                </div>

                <table className="w-full mb-6">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="py-3 px-2 text-left">Description</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Rate</th>
                      <th className="py-3 px-2 text-right">Discount</th>
                      <th className="py-3 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter((item) => item.desc).length > 0 ? (
                      items
                        .filter((item) => item.desc)
                        .map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-2">{item.desc}</td>
                            <td className="py-3 px-2 text-center">
                              {item.qty}
                            </td>
                            <td className="py-3 px-2 text-right">
                              ₹{parseFloat(item.rate).toFixed(2)}
                            </td>
                            <td className="py-3 px-2 text-right text-green-600">
                              {item.discount > 0
                                ? `-₹${parseFloat(item.discount).toFixed(2)}`
                                : "-"}
                            </td>
                            <td className="py-3 px-2 text-right font-bold">
                              ₹{parseFloat(item.total).toFixed(2)}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="py-4 text-center text-gray-500"
                        >
                          No items added
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flex justify-end mb-6">
                  <div className="w-80">
                    <div className="flex justify-between mb-2 text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-gray-700">
                      <span>Tax ({taxRate}%):</span>
                      <span className="font-bold">₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-gray-800 pt-3 border-t-2 border-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-2">
                      Notes & Terms:
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line text-sm">
                      {notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
