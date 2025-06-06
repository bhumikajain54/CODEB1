import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import ManageChain from "./components/ManageChain"; // Import the ManageChain component
import AdminDashboard from "./components/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import "./App.css";
import ManageBrands from "./components/ManageBrands";
import ManageZones from "./components/ManageZones";
import ManageEstimate from "./components/ManageEstimate";
import CreateInvoice from "./components/CreateInvoice";
import InvoiceManagement from "./components/InvoiceManagement";
import GroupManagement from "./components/GroupManagement";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto py-4">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute allowedRoles={["USER"]} />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/groups" element={<GroupManagement />} />
                <Route path="/chains" element={<ManageChain />} /> {/* Use ManageChain component */}
                <Route path="/brands" element={<ManageBrands />} />
                <Route path="/subzones" element={<ManageZones />} />
                <Route path="/estimates" element={<ManageEstimate />} />
                <Route path="/invoices" element={<CreateInvoice />} />
                <Route path="/invoice" element={<InvoiceManagement />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;