// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "../../axios/axios";
// import api from "../../axios/axios";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
 
// const [user, setUser] = useState(null);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [error, setError] = useState(null);
//   const[load,setLoad]= useState(true);
//   // 🔄 Restore login on refresh
//   const logout = () => {
//   sessionStorage.removeItem("token");
//   localStorage.removeItem("user");
//   delete api.defaults.headers.common["Authorization"];
//   setUser(null);
//   setIsLoggedIn(false);
// };

// useEffect(() => {
//   try {
//     const token = sessionStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token) {
//       api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       setIsLoggedIn(true);
//     }

//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   } catch (e) {
//     console.error("Auth restore failed", e);
//     logout();   // ✅ now safe
//   } finally {
//     setLoading(false);
//   }
// }, []);


//   // 🔐 LOGIN
//   const login = async (email, password) => {
//     if (!email || !password) {
//       setError("Please enter email and password");
//       return;
//     }

//     try {
//       const response = await api.post("/user/login", {
//         email,
//         password,
//       });

//       const { token, user } = response.data;

//       if (!token) {
//         setError("Login failed");
//         return;
//       }

//       // Store token
//       sessionStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Attach token to axios for future requests
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
//       setUser(user);

//       setIsLoggedIn(true);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//       throw err;
//     }
//   };

//   const signup = async ({
//   name,
//   email,
//   letterpad,
//   password,
//   address,
//   cName,
//   cPhone
// })  => {
//     if (!email || !password||!name||!letterpad||!address||!cName||!cPhone) {
//       setError("Please enter all required fields");
//       return;
//     }

//     try {
//       const response = await api.post("/user/signup", {
//         name,email,letterpad,password,address,cName,cPhone
//       });

//       const { token, user } = response.data;

//       if (!token) {
//         setError("Login failed");
//         return;
//       }

//       // Store token
//       sessionStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Attach token to axios for future requests
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
//       setUser(user);
//       setIsLoggedIn(true);
//       setError(null);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//       throw err;
//     }
//   };

//   // 🚪 LOGOUT
// //  const logout = () => {
// //   sessionStorage.removeItem("token");
// //   localStorage.removeItem("user");

// //   delete api.defaults.headers.common["Authorization"];

// //   setUser(null);
// //   setIsLoggedIn(false);

// // };


//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn,
//         load,
//         signup,
//         login,
//         logout,
//         error,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../axios/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(true);

  // 🚪 LOGOUT
  const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
  };

  // 🔄 Restore login
  useEffect(() => {
    try {
      const token = sessionStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setIsLoggedIn(true);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Auth restore failed", e);
      logout();
    } finally {
      setLoad(false);   // ✅ FIXED
    }
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const { data } = await api.post("/user/login", { email, password });
      const { token, user } = data;

      sessionStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    }
  };

  // 📝 SIGNUP
  const signup = async (payload) => {
    const { name, email, letterpad, password, address, cName, cPhone } = payload;

    if (!name || !email || !password || !letterpad || !address || !cName || !cPhone) {
      setError("Please enter all required fields");
      return;
    }

    try {
      const { data } = await api.post("/user/signup", payload);
      const { token, user } = data;

      sessionStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        load,
        signup,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
