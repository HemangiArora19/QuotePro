
// import React, { useState } from 'react';
// import { useAuth } from '../context/Auth/authContext';
// const Navbar = () => {
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const {isLoggedIn,user}=useAuth()
//   // Demo user data
// //   const user1 = {
// //     name: p1.name,
// //     email: p1.email,
// //     avatar: 'SK'
// //   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setShowUserMenu(false);
//     alert('Logged out successfully!');
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">Q</span>
//             </div>
//             <span className="text-2xl font-bold text-gray-800">QuotePro</span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {isLoggedIn ? (
//               <>
//                 {/* Logged In Menu */}
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   Dashboard
//                 </a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   Quotations
//                 </a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   Invoices
//                 </a>
//                 <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
//                   + New Quotation
//                 </button>

//                 {/* User Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowUserMenu(!showUserMenu)}
//                     className="flex items-center space-x-2 focus:outline-none"
//                   >
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                       {"SK"}
//                     </div>
//                     <svg className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {showUserMenu && (
//                     <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-sm font-semibold text-gray-900">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                       <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
//                         My Profile
//                       </a>
//                       <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
//                         Settings
//                       </a>
//                       <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
//                         Billing
//                       </a>
//                       <div className="border-t border-gray-100 mt-2 pt-2">
//                         <button
//                           onClick={handleLogout}
//                           className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
//                         >
//                           Sign Out
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <>
//                 {/* Not Logged In Menu */}
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   Features
//                 </a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   Pricing
//                 </a>
//                 <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
//                   About
//                 </a>
//                 <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition">
//                   Sign In
//                 </button>
//                 <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md font-medium">
//                   Sign Up
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setShowMobileMenu(!showMobileMenu)}
//               className="text-gray-700 hover:text-gray-900 focus:outline-none"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {showMobileMenu ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {showMobileMenu && (
//           <div className="md:hidden border-t border-gray-100 py-4">
//             {isLoggedIn ? (
//               <>
//                 {/* Mobile Logged In Menu */}
//                 <div className="px-4 py-3 border-b border-gray-100 mb-2">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                       {user.avatar}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-900">{user.name}</p>
//                       <p className="text-xs text-gray-500">{user.email}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Dashboard
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Quotations
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Invoices
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   My Profile
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Settings
//                 </a>
//                 <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
//                   + New Quotation
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full mt-2 px-4 py-2 text-red-600 hover:bg-red-50 transition rounded-md font-medium"
//                 >
//                   Sign Out
//                 </button>
//               </>
//             ) : (
//               <>
//                 {/* Mobile Not Logged In Menu */}
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Features
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   Pricing
//                 </a>
//                 <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
//                   About
//                 </a>
//                 <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
//                   Sign In
//                 </button>
//                 <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium">
//                   Sign Up
//                 </button>
//               </>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Demo Toggle Button (for testing) */}
//       <div className="bg-yellow-100 border-t border-yellow-300 px-4 py-2">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <p className="text-xs text-yellow-800">Demo Mode: Toggle login state</p>
//           <button
//             onClick={() => setIsLoggedIn(!isLoggedIn)}
//             className="px-4 py-1 bg-yellow-500 text-white rounded text-xs font-semibold hover:bg-yellow-600 transition"
//           >
//             {isLoggedIn ? 'Simulate Logout' : 'Simulate Login'}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar

import React, { useState } from 'react';
import { useAuth } from '../context/Auth/authContext';

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isLoggedIn, user,loading } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
    alert('Logged out successfully!');
  };

  // Loading skeleton component for user info
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
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">QuotePro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Logged In Menu */}
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Dashboard
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Quotations
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Invoices
                </a>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
                  + New Quotation
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 focus:outline-none"
                    disabled={!user}
                  >
                    {user ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name ? user.name.substring(0, 2).toUpperCase() : "SK"}
                        </div>
                        <svg className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </>
                    ) : (
                      // Loading spinner for avatar
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                        <svg className="w-5 h-5 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
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
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        My Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        Settings
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        Billing
                      </a>
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
                {/* Not Logged In Menu */}
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Features
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Pricing
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  About
                </a>
                <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition">
                  Sign In
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md font-medium">
                  Sign Up
                </button>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {isLoggedIn ? (
              <>
                {/* Mobile Logged In Menu */}
                <div className="px-4 py-3 border-b border-gray-100 mb-2">
                  <div className="flex items-center space-x-3">
                    {!loading ? (
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
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <UserInfoSkeleton />
                      </>
                    )}
                  </div>
                </div>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Dashboard
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Quotations
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Invoices
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  My Profile
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Settings
                </a>
                <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
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
                {/* Mobile Not Logged In Menu */}
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Features
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  Pricing
                </a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition rounded-md">
                  About
                </a>
                <button className="w-full mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                  Sign In
                </button>
                <button className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium">
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>

      
      
    </nav>
  );
}

export default Navbar;