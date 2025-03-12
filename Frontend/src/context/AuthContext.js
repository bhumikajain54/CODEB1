import React, { createContext, useState, useEffect } from "react";
import { getCurrentUser, logout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    logout: () => {
      logout();
      setCurrentUser(null);
    },
    hasRole: (role) => {
      if (!currentUser || !currentUser.role) return false;
      
      // Convert from ROLE_ADMIN format to ADMIN if needed
      const userRole = currentUser.role.replace("ROLE_", "");
      return userRole === role;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
