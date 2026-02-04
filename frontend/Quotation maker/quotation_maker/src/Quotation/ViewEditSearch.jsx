import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../context/Auth/authContext';
import api from '../axios/axios';
import { useNavigate } from 'react-router';

export default function ViewEditSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigator= useNavigate();

const user= localStorage.getItem("user");

  // Fetch quotations from API
  useEffect(() => {
    fetchQuotations();
  }, []);
  


  const fetchQuotations = async () => {
     if(!user){
navigator("/login");
return;
     } 
    setLoading(true);
    try {
      // Replace this with your actual API endpoint
      // const response = await fetch('/api/quotations');
      // const data = await response.json();
      // setQuotations(data);
    
      const id=JSON.parse(user).id;
      

      // Simulating API call with setTimeout

        const response= await api.get(`/offer/get/${id}`);
        
           setQuotations(response.data.offers);
        setLoading(false);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesSearch = quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

const handlePreview = (quotation) => {
    navigator("/preview_quote", {
      state: { quotation }
    });
  }




  const handleEdit = (id) => {
    alert(`Edit quotation ${id} - This would navigate to edit page`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        // Replace with actual API call
        // await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
        
        setQuotations(quotations.filter(q => q.id !== id));
        alert('Quotation deleted successfully!');
      } catch (error) {
        console.error('Error deleting quotation:', error);
        alert('Failed to delete quotation');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <Navbar/>
      <div className="max-w-7xl mx-auto">
        {/* Search Bar and New Button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search by client name or quotation number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            {/* New Quotation Button */}
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg font-semibold whitespace-nowrap">
              + New Quotation
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12">
            <div className="flex flex-col items-center justify-center">
              {/* Skeleton Loaders */}
              <div className="w-full space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </div>
                      <div className="flex flex-col md:items-end gap-3">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                        <div className="flex gap-2">
                          <div className="h-10 bg-gray-200 rounded w-20"></div>
                          <div className="h-10 bg-gray-200 rounded w-20"></div>
                          <div className="h-10 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Quotations List */
          <div className="grid gap-4">
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <div key={quotation.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{quotation?.quoteNumber}</h3>
                      <p className="text-gray-600 mb-1">
                        <span className="font-medium">Client:</span> {quotation?.clientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Date:</span> {quotation?.quoteDate
}
                      </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {quotation?.subtotal+quotation?.taxAmount}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(quotation)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(quotation.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(quotation.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No quotations found</h3>
                <p className="text-gray-500">Try adjusting your search or create a new quotation</p>
              </div>
            )}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedQuotation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quotation Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="p-8">
                <div className="border-b-4 border-blue-600 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Company Name</h1>
                      <div className="text-gray-600 text-sm">
                        <p>company@example.com</p>
                        <p>+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold mb-2">QUOTATION</div>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Quote #:</span> {selectedQuotation.number}</p>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Date:</span> {selectedQuotation.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 text-sm mb-1">Bill To:</h3>
                  <p className="font-bold text-gray-800 text-lg">{selectedQuotation.clientName}</p>
                </div>

                <table className="w-full mb-6">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Rate</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuotation.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">{item.desc}</td>
                        <td className="py-3 px-4 text-center">{item.qty}</td>
                        <td className="py-3 px-4 text-right">${item.rate.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-bold">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-6">
                  <div className="w-80">
                    <div className="flex justify-between text-2xl font-bold text-gray-800 pt-3 border-t-2 border-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">${selectedQuotation.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      handleEdit(selectedQuotation.id);
                    }}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Edit Quotation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}