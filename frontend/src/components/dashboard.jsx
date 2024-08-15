import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/dashboard.css";
import Sidebar from "./dashboard_components/sidebar";
import Navbar from "./dashboard_components/navbar";

// Dashboard component
const Dashboard = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

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

  axios.defaults.withCredentials = true;

  // To detect if the user is logged in and get firstname from token
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

  // Handle signout
  const handleSignout = async () => {
    axios
      .get("http://localhost:3000/auth/signout")
      .then((response) => {
        if (response.data.status) {
          setSuccessMessage("Signout successful!");
          navigate("/signin", {
            state: { successMessage: "SignOut successful!" },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="main-header">
            <Navbar />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
