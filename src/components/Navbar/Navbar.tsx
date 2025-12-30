import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/user.png";
import "./Navbar.css";
import Login from "../../pages/auth/Login/Login";
import Register from "../../pages/auth/Register/Register";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Fixed import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCar,
  faCalendarAlt,
  faLifeRing,
  faDoorOpen,
  faPlus,
  faBars,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import type { User } from "../../types/user";
import { fetchUserProfile } from "../../services/auth";

interface TokenPayload {
  role: "host" | "guest" | "admin";
}

interface NavbarProps {
  profilePicUrl?: string | null;
}

export default function Navbar({
  profilePicUrl: propProfilePicUrl,
}: NavbarProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"host" | "guest" | "admin" | null>(null);
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [remark, setRemark] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(
    propProfilePicUrl ?? null
  );

  const profileMenuRef = useRef<HTMLUListElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const navMenuRef = useRef<HTMLUListElement | null>(null);

  // Close menus when clicking outside
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

  // Load user from localStorage and decode role
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

  // Fetch profile picture from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profile = await fetchUserProfile(token);
        setUser(profile);
        setProfilePicUrl(profile.profile_pic || null);

        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    loadUserProfile();
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
    setRemark("");
    setActiveModal(null);
  };

  // Menu items per role
  const menuItems =
    role === "host"
      ? [
          "Add a Car",
          "My Cars",
          "My Bookings",
          "My Profile",
          "Support",
          "Logout",
        ]
      : role === "guest"
      ? ["Book a Car", "My Bookings", "My Profile", "Support", "Logout"]
      : [];

  const iconMap: Record<string, any> = {
    "Add a Car": faPlus,
    "My Cars": faCar,
    "My Bookings": faCalendarAlt,
    "My Profile": faUser,
    Support: faLifeRing,
    Logout: faDoorOpen,
    "Book a Car": faCar,
  };

  const handleMenuClick = (item: string) => {
    switch (item) {
      case "Add a Car":
        navigate("/add-car");
        break;
      case "My Cars":
        navigate("/my-cars");
        break;
      case "My Bookings":
        navigate(role === "host" ? "/host-mybookings" : "/guest-mybookings");
        break;
      case "Book a Car":
        navigate("/searched-cars");
        break;
      case "My Profile":
        navigate("/my-profile");
        break;
      case "Support":
        navigate("/support");
        break;
      case "Logout":
        handleLogout();
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
            if (e.key === "Enter" || e.key === " ") setNavOpen((prev) => !prev);
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
              SelfDrive-Car
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/community"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setNavOpen(false)}
            >
              Community
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setNavOpen(false)}
            >
              Support
            </NavLink>
          </li>
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
                src={profilePicUrl || user.avatar || defaultAvatar}
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
                        if (e.key === "Enter" || e.key === " ")
                          handleMenuClick(item);
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
        <ModalWrapper
          onClose={() => {
            setActiveModal(null);
            setRemark("");
          }}
        >
          {activeModal === "login" ? (
            <Login
              onClose={() => {
                setActiveModal(null);
                setRemark("");
              }}
              onSwitch={() => {
                setActiveModal("register");
                setRemark("");
              }}
              onLoginSuccess={handleUserLogin}
              remark={remark}
            />
          ) : (
            <Register
              onClose={() => setActiveModal(null)}
              onSwitch={() => {
                setActiveModal("login");
                setRemark("");
              }}
              onRegisterSuccess={() => {
                setRemark(
                  "Verification sent to your email/ phone no. Complete the verification to enable the login"
                );
                setActiveModal("login");
              }}
            />
          )}
        </ModalWrapper>
      )}
    </>
  );
}
