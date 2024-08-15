import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../css/signin.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Signin component
const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message in the location state
  useEffect(() => {
    if (location.state && location.state.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location]);

  // Clear success message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  Axios.defaults.withCredentials = true;

  // To detect if the user is logged in
  useEffect(() => {
    Axios.get("http://localhost:3000/auth/verify", {
      withCredentials: true,
    }).then((res) => {
      if (res.data.status) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  // Password validation
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/;
    return re.test(password);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic password validation
    const newErrors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be 8-32 characters long and contain letters and numbers.";
    }

    setErrors(newErrors);

    // If there are errors, don't submit the form
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Signin
    Axios.post("http://localhost:3000/auth/signin", {
      email,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          setSuccessMessage("Signin successful!");
          navigate("/verifyuser", {
            state: {
              email: email,
              successMessage: "Please Verify to Proceed.",
            },
          });
        } else {
          setErrors({ ...errors, password: response.data.message });
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors({ ...errors, password: "Invalid email or password." });
      });
  };

  return (
    <div className="signin-container">
      <div className="signin-overlay">
        <form className="signin-form" onSubmit={handleSubmit}>
          {/* Back button */}
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          <h2>Sign In</h2>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {/* Email */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* Password */}
          <label htmlFor="password">Password:</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-control"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="input-group-text toggle-password"
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

          <button type="submit">Sign In</button>
          <p>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </p>
          <p>
            Don't have an Account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
