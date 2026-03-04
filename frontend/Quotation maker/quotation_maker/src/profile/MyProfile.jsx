import Swal from 'sweetalert2';
import Navbar from '../Navbar/Navbar';

import React, { useState,useEffect } from 'react';
import api from '../axios/axios';
const MyProfile = () => {

  const [isBusinessEditing, setIsBusinessEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const[gst,setGST]=useState("");
  const[bankName,setBankName]=useState("");
  const[accountNumber,setAccountNumber]=useState("");
  const[ifscCode,setIfscCode]=useState("");
  const[accName,setAccName]=useState("");
  const[branch,setBranch]=useState("");
  const [companyName, setCompanyName] = useState('ABC Construction Co.');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@abcconstruction.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Business Park, Suite 456\nSan Francisco, CA 94105');
  const [id,setId]=useState("")
  const [tempCompanyName, setTempCompanyName] = useState(companyName);
  const [tempLogo, setTempLogo] = useState(null);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempAddress, setTempAddress] = useState(address);
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("user"));
    if(user){
        setCompanyName(user.cName)
        setCompanyLogo(user.letterpad)
        setAddress(user.address)
        setEmail(user.email)
        setPhone(user.cPhone)
        setName(user.name)
        setTempLogo(user.letterpad)
        setTempAddress(user.address)
        setTempEmail(user.email)
        setTempPhone(user.cPhone)
        setId(user.id)
        setBankName(user.bankName)
        setGST(user.gstNo)
        setAccountNumber(user.accNo)
        setIfscCode(user.ifscCode)
        setAccName(user.accName)
        setBranch(user.branch)

    }

  },[])
const uploadLogo = async () => {
  if (!logoFile) return companyLogo; // keep old logo if not changed

  const formData = new FormData();
  formData.append("file", logoFile);
  formData.append("upload_preset", "letterhead_preset");
  formData.append("folder", "quotations/letterheads");

  const res = await fetch("https://api.cloudinary.com/v1_1/dbj9g0m7c/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

  const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    Swal.fire("Error", "File size should not exceed 2MB", "error");
    return;
  }

  setLogoFile(file); // store real file

  const reader = new FileReader();
  reader.onload = (event) => {
    setTempLogo(event.target.result); // preview
  };
  reader.readAsDataURL(file);
};

 const saveBusinessInfo = async () => {
  if (!tempCompanyName) {
    return Swal.fire("Warning", "Company name is required", "warning");
  }

  try {
    const logoUrl = await uploadLogo();

    await api.post("/user/bussEdit", {
      companyName: tempCompanyName,
      companyLogo: logoUrl,
      bankName: bankName,
      gst: gst,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
      accName: accName,
      branch: branch,
      id,
    });

    setCompanyName(tempCompanyName);
    setCompanyLogo(logoUrl);
    setIsBusinessEditing(false);

    Swal.fire("Success", "Business information updated successfully", "success");
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Something went wrong",
      "error"
    );
  }
};

  const cancelBusinessEdit = () => {
    setTempCompanyName(companyName);
    setTempLogo(null);
    setIsBusinessEditing(false);
  };

  const saveContactInfo = async() => {
    setEmail(tempEmail);
    setPhone(tempPhone);
    setAddress(tempAddress);
    setIsContactEditing(false);


    try{
       //validation
       if(!email||!phone||!address){
        Swal.fire({
           icon:"error",
           title:"Details are not filled",
           text:"Fill all the details"
        })
        return;
       }
       //now api calling
       const response= await api.post("/user/contactEdit",{
        email:tempEmail,
        phone:tempPhone,
        address:tempAddress,
        id,
       })
       Swal.fire({
        icon:"question",
        title:"Successful",
        text:response?.message ||"Details changed succesfully !!"
       })

    }catch(err){
        Swal.fire({
            icon:"error",
            title:"Error updating",
            text:err?.response.error
        })
    }
  };

  const cancelContactEdit = () => {
    setTempEmail(email);
    setTempPhone(phone);
    setTempAddress(address);
    setIsContactEditing(false);
  };

  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen">
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-24 sm:h-32"></div>
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 w-full">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-xl bg-white flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-indigo-600">JD</span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 sm:p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </button>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-purple-100 shadow-sm text-center sm:text-left w-full sm:w-auto">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">{companyName}</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">{name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Member since Jan 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4 sm:space-y-6">
            {/* Business Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Business Information
                </h2>
                <button
                  onClick={() => {
                    if (isBusinessEditing) {
                      cancelBusinessEdit();
                    } else {
                      setTempCompanyName(companyName);
                      setIsBusinessEditing(true);
                    }

                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isBusinessEditing ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    )}
                  </svg>
                  {isBusinessEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!isBusinessEditing ? (
              <div className="space-y-4">
  <div>
    <p className="text-gray-500 mb-2 text-sm">Company Name</p>
    <p className="text-gray-800 font-medium">{companyName}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">GST Number</p>
    <p className="text-gray-800 font-medium">{gst || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">Bank Name</p>
    <p className="text-gray-800 font-medium">{bankName || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">Account Holder Name</p>
    <p className="text-gray-800 font-medium">{accName || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">Account Number</p>
    <p className="text-gray-800 font-medium">{accountNumber || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">IFSC Code</p>
    <p className="text-gray-800 font-medium">{ifscCode || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">Branch</p>
    <p className="text-gray-800 font-medium">{branch || "—"}</p>
  </div>

  <div>
    <p className="text-gray-500 mb-2 text-sm">Company Logo</p>
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300 overflow-hidden">
        {companyLogo ? (
          <img src={companyLogo} className="w-full h-full object-cover rounded-lg" alt="Company Logo" />
        ) : (
          <span className="text-gray-400 text-sm">No Logo</span>
        )}
      </div>
    </div>
  </div>
</div>

              ) : (
                <div className="space-y-4">
  <div>
    <label className="text-gray-500 mb-2 text-sm block">Company Name</label>
    <input
      type="text"
      value={tempCompanyName}
      onChange={(e) => setTempCompanyName(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">GST Number</label>
    <input
      type="text"
      value={gst}
      onChange={(e) => setGST(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">Bank Name</label>
    <input
      type="text"
      value={bankName}
      onChange={(e) => setBankName(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">Account Holder Name</label>
    <input
      type="text"
      value={accName}
      onChange={(e) => setAccName(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">Account Number</label>
    <input
      type="text"
      value={accountNumber}
      onChange={(e) => setAccountNumber(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">IFSC Code</label>
    <input
      type="text"
      value={ifscCode}
      onChange={(e) => setIfscCode(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  <div>
    <label className="text-gray-500 mb-2 text-sm block">Branch</label>
    <input
      type="text"
      value={branch}
      onChange={(e) => setBranch(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    />
  </div>

  {/* logo section stays same */}
  <div>
      <label className="text-gray-500 mb-2 text-sm block">Company Logo</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300 overflow-hidden">
          {tempLogo || companyLogo ? (
            <img
              src={tempLogo || companyLogo}
              className="w-full h-full object-cover rounded-lg"
              alt="Company Logo"
            />
          ) : (
            <span className="text-gray-400 text-sm">No Logo</span>
          )}
        </div>

        <input
          type="file"
          id="logoInput"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => document.getElementById("logoInput").click()}
          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition"
        >
          Upload Logo
        </button>
      </div>
      <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveBusinessInfo}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelBusinessEdit}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
    </div>

</div>

              )}
            </div>

            {/* Contact Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Contact Details
                </h2>
                <button
                  onClick={() => {
                    if (isContactEditing) {
                      cancelContactEdit();
                    } else {
                      setTempEmail(email);
                      setTempPhone(phone);
                      setTempAddress(address);
                      setIsContactEditing(true);
                    }
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isContactEditing ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    )}
                  </svg>
                  {isContactEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!isContactEditing ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-800">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-800">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm text-gray-800 whitespace-pre-line">{address}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 mb-2 text-sm block">Email</label>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-2 text-sm block">Phone</label>
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-2 text-sm block">Address</label>
                    <textarea
                      rows="3"
                      value={tempAddress}
                      onChange={(e) => setTempAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={saveContactInfo}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelContactEdit}
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MyProfile
