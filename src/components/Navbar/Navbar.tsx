import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/amit.jpeg";
import "./Navbar.css";
import Login from "../../pages/auth/Login/Login";
import Register from "../../pages/auth/Register/Register";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faCalendarAlt,
  faCreditCard,
  faBell,
  faLifeRing,
  faDoorOpen,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import type { User } from "../../types/user";

interface TokenPayload {
  role: "host" | "guest";
}

const hostMenu = [
  "Add a car",
  "My cars",
  "My bookings",
  "My Payments",
  "Notifications",
  "Support",
  "Logout",
];

const guestMenu = [
  "Book a car",
  "My bookings",
  "My payments",
  "Notifications",
  "Support",
  "Logout",
];

// Icon map
const iconMap: Record<string, any> = {
  "Add a car": faPlus, // show plus icon
  "My cars": faCar,
  "My bookings": faCalendarAlt,
  "My Payments": faCreditCard,
  Notifications: faBell,
  Support: faLifeRing,
  Logout: faDoorOpen,
  "Book a car": faCar,
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"host" | "guest" | null>(null);
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [showMenu, setShowMenu] = useState(false);

  // Load user & role on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    setShowMenu(false);
  };

  const handleUserLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch {}
    }

    setActiveModal(null);
  };

  const menuItems = role === "host" ? hostMenu : guestMenu;

  return (
    <>
      <nav className="scroll-navbar">
        <div className="scroll-navbar-logo">
          <img src={logo} alt="Logo" />
        </div>

        <ul className="scroll-navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cars">Cars</Link>
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
            <div className="user-profile-wrapper">
              <img
                src={user.avatar || defaultAvatar}
                alt="Profile"
                className="profile-avatar"
                onClick={() => setShowMenu((prev) => !prev)}
              />
              {showMenu && (
                <ul className="profile-menu">
                  {menuItems.map((item, idx) =>
                    item === "Logout" ? (
                      <li key={idx} onClick={handleLogout}>
                        <FontAwesomeIcon
                          icon={iconMap[item]}
                          className="menu-icon"
                        />
                        {item}
                      </li>
                    ) : (
                      <li key={idx}>
                        <FontAwesomeIcon
                          icon={iconMap[item]}
                          className="menu-icon"
                        />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </nav>

      {activeModal && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          {activeModal === "login" ? (
            <Login
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("register")}
              onLoginSuccess={handleUserLogin}
            />
          ) : (
            <Register
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("login")}
              onRegisterSuccess={handleUserLogin}
            />
          )}
        </ModalWrapper>
      )}
    </>
  );
}
