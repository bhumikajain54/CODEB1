// PrivateRoute.js - Updated to handle role-based authorization
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { currentUser } = useContext(AuthContext);

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0) {
    const userRole = currentUser.role.replace('ROLE_', '');
    const hasRequiredRole = allowedRoles.includes(userRole);
    
    if (!hasRequiredRole) {
      // Redirect to a general route if not authorized
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default PrivateRoute;