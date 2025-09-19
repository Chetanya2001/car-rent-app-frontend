import { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/user.png";
import "./Navbar.css";
import Login from "../../pages/auth/Login/Login";
import Register from "../../pages/auth/Register/Register";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { Link, useNavigate } from "react-router-dom";
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
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import type { User } from "../../types/user";

interface TokenPayload {
  role: "host" | "guest";
}

const hostMenu = [
  "Add a Car",
  "My Cars",
  "My Bookings",
  "My Payments",
  "Notifications",
  "Support",
  "Logout",
];

const guestMenu = [
  "Book a Car",
  "My Bookings",
  "My Payments",
  "Notifications",
  "Support",
  "Logout",
];

const iconMap: Record<string, any> = {
  "Add a Car": faPlus,
  "My Cars": faCar,
  "My Bookings": faCalendarAlt,
  "My Payments": faCreditCard,
  Notifications: faBell,
  Support: faLifeRing,
  Logout: faDoorOpen,
  "Book a Car": faCar,
};

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"host" | "guest" | null>(null);
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [showMenu, setShowMenu] = useState(false); // profile dropdown
  const [navOpen, setNavOpen] = useState(false); // hamburger nav links
  const profileMenuRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown/profile nav on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load user/role from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    setShowMenu(false);
    setNavOpen(false);
    navigate("/");
  };

  const handleUserLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token after login", err);
      }
    }
    setActiveModal(null);
  };

  const menuItems = role === "host" ? hostMenu : guestMenu;

  const handleMenuClick = (item: string) => {
    switch (item) {
      case "Add a Car":
        navigate("/add-car");
        break;
      case "My Cars":
        navigate("/my-cars");
        break;
      case "Logout":
        handleLogout();
        break;
      case "Book a Car":
        navigate("/cars");
        break;
      case "My Bookings":
        navigate("/my-bookings");
        break;
      case "My Payments":
        navigate("/my-payments");
        break;
      case "Notifications":
        navigate("/notifications");
        break;
      case "Support":
        navigate("/support");
        break;
      default:
        break;
    }
    setShowMenu(false); // close menu after click
    setNavOpen(false);
  };

  return (
    <>
      <nav className="scroll-navbar">
        <div className="scroll-navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div
          className="scroll-navbar-hamburger"
          onClick={() => setNavOpen((prev) => !prev)}
          ref={hamburgerRef}
        >
          <FontAwesomeIcon icon={navOpen ? faTimes : faBars} size="lg" />
        </div>
        <ul className={`scroll-navbar-links${navOpen ? " active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setNavOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/cars" onClick={() => setNavOpen(false)}>
              Cars
            </Link>
          </li>
          <li>
            <a href="#services" onClick={() => setNavOpen(false)}>
              Community
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setNavOpen(false)}>
              Support
            </a>
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
                <ul className="profile-menu-outside" ref={profileMenuRef}>
                  {menuItems.map((item, idx) => (
                    <li key={idx} onClick={() => handleMenuClick(item)}>
                      <FontAwesomeIcon
                        icon={iconMap[item]}
                        className="menu-icon"
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Login/Register Modal */}
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
