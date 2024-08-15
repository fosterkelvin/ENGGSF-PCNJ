import React from "react";
import { useNavigate } from "react-router-dom";

// SignUpButton component
const SignUpButton = () => {
  const navigate = useNavigate();

  // Navigate to the signup page
  const SignUpButton = () => {
    navigate("/signup");
  };

  return (
    <button type="button" className="btn btn-primary btn-sm" onClick={SignUpButton}>
      Sign Up
    </button>
  );
};

export default SignUpButton;
