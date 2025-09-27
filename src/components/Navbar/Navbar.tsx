import { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/user.png";
import "./Navbar.css";
import Login from "../../pages/auth/Login/Login";
import Register from "../../pages/auth/Register/Register";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { NavLink, useNavigate } from "react-router-dom";
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
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import type { User } from "../../types/user";

interface TokenPayload {
  role: "host" | "guest" | "admin";
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
  "My Documents",
  "My Payments",
  "Notifications",
  "Support",
  "Logout",
];

const AdminMenu = [
  "Cars",
  "Bookings",
  "Guests",
  "Hosts",
  "Payments",
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
  "My Documents": faFile,
};

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"host" | "guest" | "admin" | null>(null);
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [showMenu, setShowMenu] = useState(false); // profile dropdown
  const [navOpen, setNavOpen] = useState(false); // hamburger nav links
  const profileMenuRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close profile dropdown
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }

      // Close hamburger nav
      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node) &&
        navMenuRef.current &&
        !navMenuRef.current.contains(event.target as Node)
      ) {
        setNavOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const menuItems =
    role === "host"
      ? hostMenu
      : role === "guest"
      ? guestMenu
      : role === "admin"
      ? AdminMenu
      : [];

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
        if (role === "admin") {
          navigate("/admin/manage-support");
        } else {
          navigate("/support");
        }
        break;
      case "Cars":
        navigate("/admin/manage-cars");
        break;
      case "Bookings":
        navigate("/admin/manage-bookings");
        break;
      case "Guests":
        navigate("/admin/manage-guests");
        break;
      case "Hosts":
        navigate("/admin/manage-hosts");
        break;
      case "Payments":
        navigate("/admin/manage-payments");
        break;
      case "My Documents":
        navigate("/my-documents");
        break;
      default:
        break;
    }
    setShowMenu(false);
    setNavOpen(false);
  };

  return (
    <>
      <nav className="scroll-navbar">
        <div className="scroll-navbar-logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Hamburger button */}
        <div
          className="scroll-navbar-hamburger"
          onClick={() => setNavOpen((prev) => !prev)}
          ref={hamburgerRef}
          role="button"
          tabIndex={0}
          aria-label={
            navOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setNavOpen((prev) => !prev);
            }
          }}
        >
          <FontAwesomeIcon icon={navOpen ? faTimes : faBars} size="lg" />
        </div>

        {/* Navigation Links */}
        <ul
          className={`scroll-navbar-links${navOpen ? " active" : ""}`}
          ref={navMenuRef}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setNavOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cars"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setNavOpen(false)}
            >
              Cars
            </NavLink>
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
          {role === "guest" && (
            <li>
              <NavLink
                to="/my-documents"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setNavOpen(false)}
              >
                My Documents
              </NavLink>
            </li>
          )}
        </ul>

        {/* Login/Profile */}
        <div className="scroll-navbar-login">
          {!user ? (
            <button
              className="btn btn-custom"
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
                    <li
                      key={idx}
                      tabIndex={0}
                      role="menuitem"
                      onClick={() => handleMenuClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleMenuClick(item);
                        }
                      }}
                    >
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
