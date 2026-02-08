import {React} from 'react'
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Navbar from './Navbar/Navbar';
const App = () => {
const navigate=useNavigate()
  return (
      <div className="min-h-screen flex flex-col">
       
      {/* Navigation - Full Width */}
      <Navbar/>
      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Create Professional <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Quotations 
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Build trust with professional documents. Generate quotations  in seconds with our easy-to-use platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg text-lg font-semibold" onClick={()=>(navigate('/quote_make'))}>
                  Create Quotation
                </button>
                {/* <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-lg text-lg font-semibold">
                  Create Invoice
                </button> */}
              </div>
              <p className="mt-6 text-sm text-gray-500">No registration required • Free to use</p>
            </div>

            {/* Preview Cards */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {/* Quotation Preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">QUOTATION</div>
                  <div className="text-sm text-gray-500">#QT-2025-001</div>
                </div>
                <div className="border-b-2 border-blue-600 pb-4 mb-4">
                  <div className="font-bold text-gray-800 text-lg">Your Company Name</div>
                  <div className="text-sm text-gray-600">company@example.com</div>
                  <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Bill To:</div>
                  <div className="font-semibold text-gray-800">Client Name</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Web Development</span>
                    <span className="font-semibold">$3,500</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Design Services</span>
                    <span className="font-semibold">$1,800</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Consulting (20hrs)</span>
                    <span className="font-semibold">$2,000</span>
                  </div>
                </div>
                <div className="border-t-2 pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-blue-600">$7,300</span>
                  </div>
                </div>
              </div>

              {/* Invoice Preview */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">QUOTATION</div>
                  <div className="text-sm text-gray-500">#QT-2025-00</div>
                </div>
                <div className="border-b-2 border-purple-600 pb-4 mb-4">
                  <div className="font-bold text-gray-800 text-lg">Your Company Name</div>
                  <div className="text-sm text-gray-600">company@example.com</div>
                  <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Quotation To:</div>
                  <div className="font-semibold text-gray-800">Client Name</div>
                  <div className="text-xs text-gray-600 mt-2">Due Date: Jan 30, 2025</div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Project Development</span>
                    <span className="font-semibold">$5,000</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Monthly Maintenance</span>
                    <span className="font-semibold">$500</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">Hosting Setup</span>
                    <span className="font-semibold">$300</span>
                  </div>
                </div>
                <div className="border-t-2 pt-4">
                  <div className="flex justify-between font-bold text-xl">
                    <span>Amount Due</span>
                    <span className="text-purple-600">$5,800</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Fast & Easy</h3>
                <p className="text-sm text-gray-600">Create in seconds</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-sm text-gray-600">Beautiful templates</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Auto Calculate</h3>
                <p className="text-sm text-gray-600">Tax & totals</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Download PDF</h3>
                <p className="text-sm text-gray-600">Print or share</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Creating Today</h2>
            <p className="text-xl text-blue-100 mb-8">No registration needed. Completely free.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg text-lg font-semibold">
                Create Quotation
              </button>
              {/* <button className="px-8 py-4 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition shadow-lg text-lg font-semibold">
                Create Invoice
              </button> */}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Full Width */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Q</span>
            </div>
            <span className="text-xl font-bold">QuotePro</span>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2025 QuotePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App