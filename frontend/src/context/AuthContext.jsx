import { createContext, useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token } = res.data;
      setToken(token);
      localStorage.setItem("token", token);
      fetchUserData(token);
    } catch (error) {
      console.error("Login error: ", error.response?.data || error.message);
    }
  };

  // handle signup
  const signup = async (name, email, password) => {
    try {
      await axios.post("/api/auth/register", { name, email, password });
      await login(email, password);
    } catch (error) {
      console.error("Signup error: ", error.response?.data || error.message);
    }
  };

  // Fetch user data
  const fetchUserData = async (token) => {
    try {
      const res = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error(
        "Fetch user error: ",
        error.response?.data || error.message
      );
    }
  };

  // Handle Logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  // Auto-fetch user on app load
  useEffect(() => {
    if (token) fetchUserData(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
