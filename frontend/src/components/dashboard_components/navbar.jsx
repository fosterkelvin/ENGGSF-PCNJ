import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Function to decode JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};

const navbar = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [firstname, setFirstname] = useState("");

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

  //To detect if the user is logged in
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/verify", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          const cookieString = document.cookie;
          const tokenCookie = cookieString
            .split("; ")
            .find((row) => row.startsWith("token="));
          if (tokenCookie) {
            const token = tokenCookie.split("=")[1];
            console.log("Token:", token); // Log the token
            const decoded = decodeJWT(token);
            console.log("Decoded token:", decoded); // Log the decoded token
            if (decoded && decoded.firstname) {
              setFirstname(decoded.firstname);
            } else {
              console.error("Failed to decode token or firstname is missing");
            }
          } else {
            console.error("Token cookie not found");
          }
        } else {
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.error("Error verifying user:", err);
      });
  }, [navigate]);

  // Handle signout
  const handleSignout = async () => {
    axios
      .get("http://localhost:3000/auth/signout")
      .then((response) => {
        if (response.data.status) {
          setSuccessMessage("Signin successful!");
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
      {/* <!-- Navbar --> */}
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
            <div className="input-group">
              <div className="input-group-prepend">
                <button type="submit" className="btn btn-search pe-1">
                  <i className="fa fa-search search-icon"></i>
                </button>
              </div>
              <input
                type="text"
                placeholder="Search ..."
                className="form-control"
              />
            </div>
          </nav>

          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
            <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <i className="fa fa-search"></i>
              </a>
              <ul className="dropdown-menu dropdown-search animated fadeIn">
                <form className="navbar-left navbar-form nav-search">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search ..."
                      className="form-control"
                    />
                  </div>
                </form>
              </ul>
            </li>
            <li className="nav-item topbar-icon dropdown hidden-caret">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="messageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-envelope"></i>
              </a>
              <ul
                className="dropdown-menu messages-notif-box animated fadeIn"
                aria-labelledby="messageDropdown"
              >
                <li>
                  <div className="dropdown-title d-flex justify-content-between align-items-center">
                    Messages
                    <a href="#" className="small">
                      Mark all as read
                    </a>
                  </div>
                </li>
                <li>
                  <div className="message-notif-scroll scrollbar-outer">
                    <div className="notif-center">
                      <a href="#">
                        <div className="notif-img">
                          <img
                            src="assets/img/jm_denis.jpg"
                            alt="Img Profile"
                          />
                        </div>
                        <div className="notif-content">
                          <span className="subject">Jimmy Denis</span>
                          <span className="block"> How are you ? </span>
                          <span className="time">5 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-img">
                          <img
                            src="assets/img/chadengle.jpg"
                            alt="Img Profile"
                          />
                        </div>
                        <div className="notif-content">
                          <span className="subject">Chad</span>
                          <span className="block"> Ok, Thanks ! </span>
                          <span className="time">12 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-img">
                          <img src="assets/img/mlane.jpg" alt="Img Profile" />
                        </div>
                        <div className="notif-content">
                          <span className="subject">Jhon Doe</span>
                          <span className="block">
                            Ready for the meeting today...
                          </span>
                          <span className="time">12 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-img">
                          <img src="assets/img/talha.jpg" alt="Img Profile" />
                        </div>
                        <div className="notif-content">
                          <span className="subject">Talha</span>
                          <span className="block"> Hi, Apa Kabar ? </span>
                          <span className="time">17 minutes ago</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="see-all" href="">
                    See all messages<i className="fa fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item topbar-icon dropdown hidden-caret">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="notifDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fa fa-bell"></i>
                <span className="notification">4</span>
              </a>
              <ul
                className="dropdown-menu notif-box animated fadeIn"
                aria-labelledby="notifDropdown"
              >
                <li>
                  <div className="dropdown-title">
                    You have 4 new notification
                  </div>
                </li>
                <li>
                  <div className="notif-scroll scrollbar-outer">
                    <div className="notif-center">
                      <a href="#">
                        <div className="notif-icon notif-primary">
                          <i className="fa fa-user-plus"></i>
                        </div>
                        <div className="notif-content">
                          <span className="block"> New user registered </span>
                          <span className="time">5 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-icon notif-success">
                          <i className="fa fa-comment"></i>
                        </div>
                        <div className="notif-content">
                          <span className="block">
                            Rahmad commented on Admin
                          </span>
                          <span className="time">12 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-img">
                          <img
                            src="assets/img/profile2.jpg"
                            alt="Img Profile"
                          />
                        </div>
                        <div className="notif-content">
                          <span className="block">
                            Reza send messages to you
                          </span>
                          <span className="time">12 minutes ago</span>
                        </div>
                      </a>
                      <a href="#">
                        <div className="notif-icon notif-danger">
                          <i className="fa fa-heart"></i>
                        </div>
                        <div className="notif-content">
                          <span className="block"> Farrah liked Admin </span>
                          <span className="time">17 minutes ago</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="see-all" href="">
                    See all notifications<i className="fa fa-angle-right"></i>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item topbar-icon dropdown hidden-caret">
              <a
                className="nav-link"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <i className="fas fa-layer-group"></i>
              </a>
              <div className="dropdown-menu quick-actions animated fadeIn">
                <div className="quick-actions-header">
                  <span className="title mb-1">Quick Actions</span>
                  <span className="subtitle op-7">Shortcuts</span>
                </div>
                <div className="quick-actions-scroll scrollbar-outer">
                  <div className="quick-actions-items">
                    <div className="row m-0">
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-danger rounded-circle">
                            <i className="far fa-calendar-alt"></i>
                          </div>
                          <span className="text">Calendar</span>
                        </div>
                      </a>
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-warning rounded-circle">
                            <i className="fas fa-map"></i>
                          </div>
                          <span className="text">Maps</span>
                        </div>
                      </a>
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-info rounded-circle">
                            <i className="fas fa-file-excel"></i>
                          </div>
                          <span className="text">Reports</span>
                        </div>
                      </a>
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-success rounded-circle">
                            <i className="fas fa-envelope"></i>
                          </div>
                          <span className="text">Emails</span>
                        </div>
                      </a>
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-primary rounded-circle">
                            <i className="fas fa-file-invoice-dollar"></i>
                          </div>
                          <span className="text">Invoice</span>
                        </div>
                      </a>
                      <a className="col-6 col-md-4 p-0" href="#">
                        <div className="quick-actions-item">
                          <div className="avatar-item bg-secondary rounded-circle">
                            <i className="fas fa-credit-card"></i>
                          </div>
                          <span className="text">Payments</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="nav-item topbar-user dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <div className="avatar-sm">
                  <i
                    className="bi bi-person-circle"
                    style={{ fontSize: "30px", color: "black" }}
                  ></i>
                </div>
                <span className="profile-username">
                  <span className="op-7">Hi, </span>
                  <span className="fw-bold">{firstname || "User"} !</span>
                </span>
              </a>

              {/* <!-- Dropdown - User Information --> */}
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleSignout}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      {/* <!-- End Navbar --> */}
    </>
  );
};

export default navbar;
