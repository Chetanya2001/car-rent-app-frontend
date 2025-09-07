import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/amit.jpeg";
import "./Navbar.css";
import Login from "../../pages/auth/Login/Login";
import Register from "../../pages/auth/Register/Register";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import type { User } from "../../types/user";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Called after successful login/register
  const handleUserLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setActiveModal(null);
  };

  return (
    <>
      <nav className="scroll-navbar">
        <div className="scroll-navbar-logo">
          <img src={logo} alt="Logo" />
        </div>

        <ul className="scroll-navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">Cars</a>
          </li>
          <li>
            <a href="#services">Community</a>
          </li>
          <li>
            <a href="#contact">Support</a>
          </li>
        </ul>

        <div className="scroll-navbar-login">
          {!user ? (
            <button
              className="btn btn-primary"
              onClick={() => setActiveModal("login")}
            >
              Login
            </button>
          ) : (
            <div className="user-profile">
              <img
                src={user.avatar || defaultAvatar}
                alt="Profile"
                className="profile-avatar"
              />
              <span className="profile-name">{user.name}</span>
              <button className="btn btn-link ms-2" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Modal Wrapper */}
      {activeModal && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          {activeModal === "login" ? (
            <Login
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("register")}
              onLoginSuccess={handleUserLogin} // ✅ must call this
            />
          ) : (
            <Register
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("login")}
              onRegisterSuccess={handleUserLogin} // ✅ must call this
            />
          )}
        </ModalWrapper>
      )}
    </>
  );
}
