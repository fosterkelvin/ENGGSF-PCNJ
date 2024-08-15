import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../css/forgotpassword.css";
import { useNavigate } from "react-router-dom";

// Forgot Password component
const forgotpassword = () => {
  const [email, setEmail] = useState("");
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3000/auth/forgotpassword", {
      email,
    })
      .then((response) => {
        console.log(response);
        if (response.data.status) {
          alert("Email Sent");
          navigate("/signin");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="forgotpassword-container">
      <div className="forgotpassword-overlay">
        <form className="forgotpassword-form" onSubmit={handleSubmit}>
          {/* Back button*/}
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left"></i>
          </button>

          {/* Forgot Password */}
          <h2>Forgot Password</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default forgotpassword;
