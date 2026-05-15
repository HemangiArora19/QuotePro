import React, { useState } from 'react';
import { useAuth } from '../context/Auth/authContext';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Navbar = () => {

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu,   setShowUserMenu]   = useState(false);
  const { isLoggedIn, loading, logout } = useAuth();
  const navigate = useNavigate(); // ✅ moved to top level (not inside handler)

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, keep me logged in",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    });
  };

  const UserInfoSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-3 bg-gray-300 rounded w-24 mb-2"></div>
      <div className="h-2 bg-gray-200 rounded w-32"></div>
    </div>
  );

  if (loading) {
    return (
      <nav className="bg-white shadow-md h-16 flex items-center px-6">
        <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Link to={"/"} className="text-white font-bold text-xl">Q</Link>
            </div>
            <Link to={"/"} className="text-2xl font-bold text-gray-800">QuotePro</Link>
          </div>

          {/* ── Desktop Navigation ── */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Dashboard
                </Link>
                <Link to="/view_quote" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Quotations
                </Link>
                <Link to="/display_invoice" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Invoices
                </Link>
                <Link to="/quote_make">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
                    + New Quotation
                  </button>
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {user ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name ? user.name.substring(0, 2).toUpperCase() : "SK"}
                        </div>
                        <svg className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-5 h-5 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        {user ? (
                          <>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </>
                        ) : (
                          <UserInfoSkeleton />
                        )}
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        My Profile
                      </Link>
                      <Link to="/payment_record" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        Payment Record
                      </Link>
                      <Link to="/receipt_register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        Receipt Register
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Features
                </Link>
                <Link to="/login">
                  <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md font-medium">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {isLoggedIn ? (
              <>
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    {user ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name ? user.name.substring(0, 2).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                          <svg className="w-5 h-5 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                        <UserInfoSkeleton />
                      </>
                    )}
                  </div>
                </div>

                {/* ✅ Mobile links match desktop links exactly */}
                <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Dashboard
                </Link>
                <Link to="/view_quote" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Quotations
                </Link>
                <Link to="/display_invoice" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Invoices
                </Link>
                <Link to="/payment_record" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Payment Reciept
                </Link>
                <Link to="/receipt_register" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Receipt Register
                </Link>
                <Link to="/profile" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  My Profile
                </Link>

                {/* ✅ Fixed: use navigate() not useNavigate() inside handler */}
                <button
                  onClick={() => { setShowMobileMenu(false); navigate("/quote_make"); }}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  + New Quotation
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 transition rounded-md font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Features
                </Link>

                {/* ✅ Fixed: wrapped in Link */}
                <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                  <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setShowMobileMenu(false)}>
                  <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;