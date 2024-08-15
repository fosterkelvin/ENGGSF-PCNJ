import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../css/signup.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Signup component
const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Check for success message in the location state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
    // Clear success message after 3 seconds
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [location]);

  // Email and password validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/.test(password);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!firstname) newErrors.firstname = "First name is required.";
    if (!lastname) newErrors.lastname = "Last name is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be 8-32 characters long and contain letters and numbers.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Signup
    Axios.post("http://localhost:3000/auth/signup", {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
    })
      .then((response) => {
        if (response.data.status) {
          setSuccessMessage("Signup successful!");
          navigate("/signin", {
            state: { successMessage: "Signup successful!" },
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            setErrors({ ...errors, email: error.response.data.message });
          } else {
            setErrors({
              ...errors,
              general: "An error occurred. Please try again.",
            });
          }
        } else {
          setErrors({ ...errors, general: "Network error. Please try again." });
        }
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-overlay">
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Back button */}
          <div className="back-button-container">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>

          {/* Signup Form */}
          <h2>Sign Up</h2>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {errors.general && (
            <span className="error-message">{errors.general}</span>
          )}

          {/*First Name*/}
          <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input
              type="text"
              id="firstname"
              required
              onChange={(e) => setFirstname(e.target.value)}
            />
            {errors.firstname && (
              <span className="error-message">{errors.firstname}</span>
            )}
          </div>

          {/*Last Name*/}
          <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input
              type="text"
              id="lastname"
              required
              onChange={(e) => setLastname(e.target.value)}
            />
            {errors.lastname && (
              <span className="error-message">{errors.lastname}</span>
            )}
          </div>

          {/*Email*/}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/*Password*/}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
              <span
                className="input-group-text-signup"
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

          {/*Confirm Password*/}
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
              />
              <span
                className="input-group-text-signup"
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

          <button type="submit">Sign Up</button>
          <p>
            Already have an Account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
