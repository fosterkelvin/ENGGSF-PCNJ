import React, { useEffect } from "react";
import SignUpButton from "./SignUpButton";
import SignInButton from "./SignInButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Landing Page component
const LandingPage = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  //To detect if the user is logged in
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/verify", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

  return (
    <>
      <div className="landing-page">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          {/* Container wrapper */}
          <div className="container-fluid">
            {/* Navbar brand */}
            <h1 className="navbar-brand">
              <span style={{ color: "white" }}>PC </span>
              <span style={{ color: "white" }}>NI </span>
              <span style={{ color: "white" }}>JUAN</span>
            </h1>
            {/* Toggle button */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarButtonsExample"
              aria-controls="navbarButtonsExample"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* Collapsible wrapper */}
            <div className="collapse navbar-collapse" id="navbarButtonsExample">
              <div className="d-flex ms-auto button-right" style={{ gap: "10px" }}>
                <SignInButton />
                <SignUpButton />
              </div>
            </div>
            {/* Collapsible wrapper */}
          </div>
          {/* Container wrapper */}
        </nav>
        {/* Navbar */}
      </div>

      <div className="landing-page-container"></div>
    </>
  );
};

export default LandingPage;
