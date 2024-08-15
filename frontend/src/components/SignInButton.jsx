import React from "react";
import { useNavigate } from "react-router-dom";

// SignInButton component
const SignInButton = () => {
  const navigate = useNavigate();

  // Navigate to the signin page
  const SignInButton = () => {
    navigate("/signin");
  };

  return (
    <button type="button" className="btn btn-success btn-sm" onClick={SignInButton}>
      Sign In
    </button>
  );
};

export default SignInButton;
