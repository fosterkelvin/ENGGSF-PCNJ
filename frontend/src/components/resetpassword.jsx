import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../css/resetpassword.css";
import { useNavigate, useParams } from "react-router-dom";

// Reset Password component
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  //To detect if the user is logged in
  useEffect(() => {
    Axios.get("http://localhost:3000/auth/verify", {
      withCredentials: true,
    }).then((res) => {
      if (res.data.status) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Reset password
    Axios.post(`http://localhost:3000/auth/resetpassword/${token}`, {
      password,
      confirmPassword,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/signin", {
            state: { successMessage: "ResetPassword successful!" },
          });
        } else {
          setServerError(response.data.message);
        }
      })
      .catch((error) => {
        setServerError("An error occurred while resetting the password.");
      });
  };

  return (
    <div className="resetpassword-container">
      <div className="resetpassword-overlay">
        <form className="resetpassword-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>

          {serverError && <span className="error-message">{serverError}</span>}

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                onChange={handlePasswordChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmpassword">Confirm Password:</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmpassword"
                required
                onChange={handleConfirmPasswordChange}
                className="form-control"
              />
              <span
                className="input-group-text"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={`fas ${
                    showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
          <br></br>
          <button type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
