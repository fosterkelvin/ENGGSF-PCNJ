import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyUser = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message in the location state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the verification code
    const newErrors = {};
    if (!verificationCode) {
      newErrors.verificationCode = "Verification code is required.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/verifyuser", {
        email: location.state.email,
        firstname: location.state.firstname,
        verificationCode,
      });

      if (response.data.status) {
        const { role, message } = response.data;

        // Redirect with user data
        navigate(role === "admin" ? "/adashboard" : "/dashboard", {
          state: { 
            email: location.state.email, 
            firstname: location.state.firstname, 
            successMessage: message 
          },
        });
      } else {
        setErrors({ verificationCode: response.data.message });
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setErrors({ verificationCode: "An error occurred." });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-overlay">
        <form className="signin-form" onSubmit={handleSubmit}>
          <button 
            type="button" 
            className="back-button" 
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2>Verification</h2>
          {successMessage && <div className="success-message">{successMessage}</div>}
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={location.state?.email || ""}
            readOnly
            autoComplete="email"
          />
          <label htmlFor="verificationCode">Verification Code:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          {errors.verificationCode && (
            <span className="error-message">{errors.verificationCode}</span>
          )}
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;
