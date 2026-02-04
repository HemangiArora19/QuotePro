import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../axios/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const[load,setLoad]= useState(true);
  // 🔄 Restore login on refresh
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoad(false);
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token) {
        setError("Login failed");
        return;
      }

      // Store token
      sessionStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Attach token to axios for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
      setUser(user);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        load,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

