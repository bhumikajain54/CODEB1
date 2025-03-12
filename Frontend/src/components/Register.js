import React, { useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    passwordHash: "",
    confirmPassword: "",
    role: "USER" // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage("");

    // Validate passwords match
    if (formData.passwordHash !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Create registration object (excluding confirmPassword)
    const { confirmPassword, ...registrationData } = formData;

    try {
      await register(registrationData);
      // Show verification message instead of immediately navigating
      setVerificationMessage(
        "Registration successful. Please check your email to verify your account."
      );
    } catch (err) {
      setError("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our platform today</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {verificationMessage && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-content">{verificationMessage}</div>
          </div>
        )}
        
        {!verificationMessage && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="passwordHash">Password</label>
              <input
                type="password"
                name="passwordHash"
                id="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Create Account"
              )}
            </button>
            
            <div className="auth-alt-action">
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;