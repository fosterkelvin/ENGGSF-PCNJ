import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import Signup from "./components/signup";
import Signin from "./components/signin";
import ForgotPassword from "./components/forgotpassword";
import LandingPage from "./components/landingpage";
import ResetPassword from "./components/resetpassword";
import Dashboard from "./components/dashboard";
import VerifyUser from "./components/verifyuser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verifyuser" element={<VerifyUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
