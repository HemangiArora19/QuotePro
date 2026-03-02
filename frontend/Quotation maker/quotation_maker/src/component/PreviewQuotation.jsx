
import React, { useState, useRef, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';
import { useLocation } from "react-router-dom";
import Navbar from '../Navbar/Navbar';
import { useReactToPrint } from "react-to-print";
import { useAuth } from '../context/Auth/authContext';
import jsPDF from "jspdf";
import api from '../axios/axios';

const PreviewQuotation = () => {
  // Sample data structure - matches your backend response
const location = useLocation();
const printRef = useRef(null);
  const [quotationData, setQuotationData] = useState({
    items: [],
    subtotal: 0,
    taxAmount: 0,
    taxRate: 0
  });

  const{ user} = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user); 
      console.log("Current User set in PreviewQuotation:", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (location?.state?.quotation) {
      setQuotationData(location.state.quotation);
      console.log(location.state.quotation);
    }
  }, [location]);
 const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: `Quotation-${quotationData.quoteNumber}`,
  removeAfterPrint: true,
});



/*   const handleDownloadPDF =useReactToPrint({
//   contentRef: printRef,
//   documentTitle: `Quotation-${quotationData.quoteNumber}`,
//   removeAfterPrint: true,
// });*/
// const handleDownloadPDF = async () => {
//   if (!printRef.current) return;

//   const html = printRef.current.outerHTML;

//   // const res = await fetch("/api/quotation/pdf", {
//   //   method: "POST",
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   //   body: JSON.stringify({
//   //     html,
//   //     fileName: `Quotation-${quotationData.quoteNumber}.pdf`,
//   //   }),
//   // });
//   const res= await api.post("/offer/pdf",{
//     html,
//     fileName: `Quotation-${quotationData.quoteNumber}.pdf`,
    
//   })

//   if (!res.ok) {
//     console.error("PDF generation failed");
//     return;
//   }

//   const blob = await res.blob();
//   const url = window.URL.createObjectURL(blob);

//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Quotation-${quotationData.quoteNumber}.pdf`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();

//   window.URL.revokeObjectURL(url);
// };


const handleDownloadPDF = async () => {
  try {
    if (!printRef.current) return;

    const html = printRef.current.outerHTML;
const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${printRef.current.innerHTML}
</body>
</html>
`;
    const res = await api.post(
      "/offer/pdf",
      {
        html: fullHtml,
        fileName: `Quotation-${quotationData.quoteNumber}.pdf`,
      },
      {
        responseType: "blob", // 🔥 VERY IMPORTANT
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = `Quotation-${quotationData.quoteNumber}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("PDF generation failed:", error);
  }
};

  return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <style>{`
//         @media print {
//           body { background: white; }
//           .no-print { display: none !important; }
//           .print-container { box-shadow: none !important; margin: 0 !important; }
//         }
//       `}</style>
//       <Navbar className='no-print'/>

//       {/* Action Buttons - Hidden in Print */}
//       <div className="max-w-4xl mx-auto mb-4 flex justify-end gap-3 no-print">
//         <button
//           onClick={handleDownloadPDF}
//           className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           <Download size={18} />
//           Download PDF
//         </button>
//         <button
//           onClick={handlePrint}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           <Printer size={18} />
//           Print
//         </button>
//       </div>
    
       
     
//       {/* Quotation Document */}
//       <div ref={printRef} className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl print-container">
        
//         {/* Company Letterpad - Will display if URL is provided from backend */}
//         {quotationData.companyLetterpad && (
//           <div className="w-full mb-0 rounded-t-2xl overflow-hidden">
//             <img 
//               src={quotationData.companyLetterpad} 
//               alt="Company Letterpad" 
//               className="w-full h-auto"
//               style={{ display: 'block', maxWidth: '100%' }}
//             />
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="p-8">
          
//           {/* Header Section with Blue Border */}
//           <div className="border-b-4 border-blue-600 pb-6 mb-6">
//   <div className="flex justify-between items-start mb-4">
//     <div className="flex items-start gap-4">
//       {/* Logo */}
//       <img
//         // src="https://res.cloudinary.com/dbj9g0m7c/image/upload/v1749391849/hem2p-products-images/f3qsrjcppmasxejaqpvb.png"
//         src={currentUser?.letterpad}
//         alt="Company Logo"
//         className="w-24 h-24 object-contain"
//       />

//       <div>
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentUser?.cName}</h1>
//         <div className="text-gray-600 text-sm">
//           <p>{currentUser?.address}</p>
//           <p>Phone: {currentUser?.cPhone}</p>
//           <p>Email: {currentUser?.email}</p>
//         </div>
//       </div>
//     </div>

//     <div className="text-right">
//       <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold mb-2">
//         QUOTATION
//       </div>
//       <p className="text-sm text-gray-600">
//         <span className="font-semibold">Quote #:</span> {quotationData.quoteNumber}
//       </p>
//       <p className="text-sm text-gray-600">
//         <span className="font-semibold">Date:</span>{" "}
//         {new Date(quotationData.quoteDate).toLocaleDateString("en-GB")}
//       </p>
//     </div>
//   </div>
// </div>


//           {/* Bill To Section */}
//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-700 text-sm mb-2">TO</h3>
//             <p className="font-bold text-gray-800 text-lg">{quotationData.clientName}</p>
//             {quotationData.clientAddress && <p className="text-gray-600 text-sm whitespace-pre-line">{quotationData.clientAddress}</p>}
//             {quotationData.kindAttention && <p className="text-gray-700 text-sm mt-2">Kind Attn: {quotationData.kindAttention}</p>}
//           </div>

//           {/* Subject */}
//           {quotationData.subject && (
//             <div className="mb-4">
//               <p className="text-gray-700">Subject: <span className="font-semibold">{quotationData.subject}</span></p>
//               <p className="text-gray-700">Dear Sir,</p>
//             </div>
//           )}

//           {/* Greeting */}
//           <div className="mb-6">
//             <p className="text-gray-700">We are highly thankful to you for your kind enquiry; please find our offer as under</p>
//           </div>

//           {/* Items Table */}
//           <table className="w-full mb-6 border-collapse">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="py-3 px-2 text-left">S/No</th>
//                 <th className="py-3 px-2 text-left">Description</th>
//                 <th className="py-3 px-2 text-right">Rate per unit</th>
//                 <th className="py-3 px-2 text-center">Qty</th>
//                 <th className="py-3 px-2 text-center">Discount</th>
//                 <th className="py-3 px-2 text-right">Amount</th>
//                 <th className="py-3 px-2 text-right">Delivery</th>
//               </tr>
//             </thead>
//             <tbody>
//               {quotationData.items.map((item, index) => (
//                 <tr key={index} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-2">{index + 1}</td>
//                   <td className="py-3 px-2 whitespace-pre-line">{item.desc}</td>
//                   <td className="py-3 px-2 text-right">₹{item.rate.toFixed(2)}</td>
//                   <td className="py-3 px-2 text-center">{item.qty}</td>
//                   <td className="py-3 px-2 text-center">
//                     {item.discount > 0 
//                       ? <span className="text-green-600 font-semibold">{item.discount}%</span>
//                       : <span className="text-xs text-green-600 font-semibold">Special Net Discounted Rate</span>
//                     }
//                   </td>

//                   <td className="py-3 px-2 text-right font-bold">₹{item.total.toFixed(2)}</td>
//                   <td className="py-3 px-2 text-right">{item.delievery || 'N/A'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Totals Section */}
//           <div className="flex justify-end mb-6">
//             <div className="w-80">
//               <div className="flex justify-between mb-2 text-gray-700">
//                 <span>Subtotal:</span>
//                 <span className="font-bold">₹{quotationData.subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between mb-2 text-gray-700">
//                 <span>Tax ({quotationData.taxRate}%):</span>
//                 <span className="font-bold">₹{quotationData.taxAmount.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-2xl font-bold text-gray-800 pt-3 border-t-2 border-gray-800">
//                 <span>Total:</span>
//                 <span className="text-blue-600">₹{(quotationData.subtotal + quotationData.taxAmount).toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Terms & Conditions */}
//           {quotationData.notes && (
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
//               <h3 className="font-bold text-gray-800 mb-2">Notes & Terms:</h3>
//               <p className="text-gray-700 whitespace-pre-line text-sm">{quotationData.notes}</p>
//             </div>
//           )}

//           {/* Closing Note */}
//          <div className="mb-6">
//   <p className="font-semibold mb-2 text-gray-800">
//     Note:{" "}
//     <span className="text-blue-600">
//       Once this order is placed, it cannot be cancelled under any circumstances.
//     </span>
//   </p>

//   <p className="mb-2 text-gray-700">
//     Looking forward to your valuable purchase order.
//   </p>

//   <p className="mb-4 text-gray-700">
//     Please feel free to contact us for any further clarification.
//   </p>

//   <p className="text-gray-700">Yours truly,</p>

//   <p className="font-semibold text-gray-800 mb-1">Neha</p>
//   <p className="font-semibold text-gray-800">Office Coordinator</p>
// </div>

//         </div>

//         {/* Footer */}
      
//           <div className="text-center text-xs mt-4 mb-4 px-8">
            
          
//               <p className="text-gray-600">{"This is system generated quotation"}</p>
           
//           </div>
      
//       </div>


//     </div>
<div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <style>{`
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .print-container { box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>
      <Navbar className='no-print'/>

      {/* Action Buttons - Hidden in Print */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 no-print">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
        >
          <Download size={18} />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          <Printer size={18} />
          Print
        </button>
      </div>

      {/* Quotation Document */}
      <div ref={printRef} className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl print-container">

        {/* Company Letterpad */}
        {quotationData.companyLetterpad && (
          <div className="w-full mb-0 rounded-t-2xl overflow-hidden">
            <img
              src={quotationData.companyLetterpad}
              alt="Company Letterpad"
              className="w-full h-auto block"
            />
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8">

          {/* Header Section with Blue Border */}
          <div className="border-b-4 border-blue-600 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Logo */}
                <img
                  src={currentUser?.letterpad}
                  alt="Company Logo"
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{currentUser?.cName}</h1>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    <p>{currentUser?.address}</p>
                    <p>Phone: {currentUser?.cPhone}</p>
                    <p>Email: {currentUser?.email}</p>
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold mb-2">
                  QUOTATION
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Quote #:</span> {quotationData.quoteNumber}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(quotationData.quoteDate).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 text-sm mb-2">TO</h3>
            <p className="font-bold text-gray-800 text-base sm:text-lg">{quotationData.clientName}</p>
            {quotationData.clientAddress && (
              <p className="text-gray-600 text-sm whitespace-pre-line">{quotationData.clientAddress}</p>
            )}
            {quotationData.kindAttention && (
              <p className="text-gray-700 text-sm mt-2">Kind Attn: {quotationData.kindAttention}</p>
            )}
          </div>

          {/* Subject */}
          {quotationData.subject && (
            <div className="mb-4">
              <p className="text-gray-700 text-sm sm:text-base">
                Subject: <span className="font-semibold">{quotationData.subject}</span>
              </p>
              <p className="text-gray-700 text-sm sm:text-base">Dear Sir,</p>
            </div>
          )}

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm sm:text-base">
              We are highly thankful to you for your kind enquiry; please find our offer as under
            </p>
          </div>

          {/* Items Table — horizontally scrollable on small screens */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full mb-6 border-collapse min-w-[580px]">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="py-3 px-2 text-left text-xs sm:text-sm">S/No</th>
                  <th className="py-3 px-2 text-left text-xs sm:text-sm">Description</th>
                  <th className="py-3 px-2 text-right text-xs sm:text-sm">Rate per unit</th>
                  <th className="py-3 px-2 text-center text-xs sm:text-sm">Qty</th>
                  <th className="py-3 px-2 text-center text-xs sm:text-sm">Discount</th>
                  <th className="py-3 px-2 text-right text-xs sm:text-sm">Amount</th>
                  <th className="py-3 px-2 text-right text-xs sm:text-sm">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {quotationData.items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 text-xs sm:text-sm">{index + 1}</td>
                    <td className="py-3 px-2 whitespace-pre-line text-xs sm:text-sm">{item.desc}</td>
                    <td className="py-3 px-2 text-right text-xs sm:text-sm">₹{item.rate.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center text-xs sm:text-sm">{item.qty}</td>
                    <td className="py-3 px-2 text-center">
                      {item.discount > 0
                        ? <span className="text-green-600 font-semibold text-xs sm:text-sm">{item.discount}%</span>
                        : <span className="text-xs text-green-600 font-semibold">Special Net Discounted Rate</span>
                      }
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-xs sm:text-sm">₹{item.total.toFixed(2)}</td>
                    <td className="py-3 px-2 text-right text-xs sm:text-sm">{item.delievery || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-6">
            <div className="w-full sm:w-72 md:w-80">
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Subtotal:</span>
                <span className="font-bold">₹{quotationData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700 text-sm sm:text-base">
                <span>Tax ({quotationData.taxRate}%):</span>
                <span className="font-bold">₹{quotationData.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-800 pt-3 border-t-2 border-gray-800">
                <span>Total:</span>
                <span className="text-blue-600">₹{(quotationData.subtotal + quotationData.taxAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          {quotationData.notes && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Notes & Terms:</h3>
              <p className="text-gray-700 whitespace-pre-line text-xs sm:text-sm">{quotationData.notes}</p>
            </div>
          )}

          {/* Closing Note */}
          <div className="mb-6">
            <p className="font-semibold mb-2 text-gray-800 text-sm sm:text-base">
              Note:{" "}
              <span className="text-blue-600">
                Once this order is placed, it cannot be cancelled under any circumstances.
              </span>
            </p>
            <p className="mb-2 text-gray-700 text-sm sm:text-base">
              Looking forward to your valuable purchase order.
            </p>
            <p className="mb-4 text-gray-700 text-sm sm:text-base">
              Please feel free to contact us for any further clarification.
            </p>
            <p className="text-gray-700 text-sm sm:text-base">Yours truly,</p>
            <p className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">Neha</p>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">Office Coordinator</p>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs mt-4 mb-4 px-4 sm:px-8">
          <p className="text-gray-600">{"This is system generated quotation"}</p>
        </div>

      </div>
    </div>
  );
};

export default PreviewQuotation;



