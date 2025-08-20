// Frontend/src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [authAllow, setAuthAllow] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserData(null);
      setAuthAllow(false);
      setLoading(false);
      return;
    }
    try {
    const res = await fetch(
      "https://quick-port-backend.vercel.app/api/auth/user",
      {
        // const res = await fetch("http://localhost:3000/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
      const data = await res.json();
      if (res.ok) {
        setUserData(data.user);
        setAuthAllow(true);
      } else {
        setUserData(null);
        setAuthAllow(false);
      }
    } catch {
      setUserData(null);
      setAuthAllow(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        userData,
        setUserData,
        authAllow,
        setAuthAllow,
        loading,
        refresh: fetchMe,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
