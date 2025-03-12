import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const token = new URLSearchParams(location.search).get("token");

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, newPassword);
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Create a new password for your account</p>
        </div>
        
        {message && (
          <div className="alert alert-success">
            <div className="alert-icon">✅</div>
            <div className="alert-content">{message}</div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">❌</div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {!message && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Reset Password"
              )}
            </button>
            
            <div className="auth-alt-action">
              Remember your password? <Link to="/login">Log in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;