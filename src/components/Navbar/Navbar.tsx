import { useState, useEffect, useRef } from "react";
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
  faLifeRing,
  faDoorOpen,
  faPlus,
  faBars,
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

  // Role-based top nav items
  const hostNavItems = [
    { label: "Add a Car", path: "/add-car", icon: faPlus },
    { label: "My Cars", path: "/my-cars", icon: faCar },
    { label: "My Bookings", path: "/host-mybookings", icon: faCalendarAlt },
    { label: "Support", path: "/support", icon: faLifeRing },
  ];

  const guestNavItems = [
    { label: "Book a Car", path: "/searched-cars", icon: faCar },
    { label: "My Bookings", path: "/guest-mybookings", icon: faCalendarAlt },
    { label: "Support", path: "/support", icon: faLifeRing },
  ];

  const profileDropdownItems = [
    { label: "My Profile", path: "/my-documents" },
    { label: "Logout", action: () => handleLogout() },
  ];

  // Handle outside click
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

  // Load user from localStorage + token
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

  // Fetch profile pic
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const profile = await fetchUserProfile(token);
        setUser(profile);
        if (profile.profile_pic) {
          setProfilePicUrl(profile.profile_pic);
          localStorage.setItem("profilePicUrl", profile.profile_pic);
        } else {
          setProfilePicUrl(null);
        }

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

  return (
    <>
      <nav className="scroll-navbar">
        <div className="scroll-navbar-logo">
          <img src={logo} alt="Logo" />
        </div>

        {/* Hamburger */}
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
          <FontAwesomeIcon icon={navOpen ? faDoorOpen : faBars} size="lg" />
        </div>

        {/* Top nav */}
        <ul
          className={`scroll-navbar-links${navOpen ? " active" : ""}`}
          ref={navMenuRef}
        >
          <li>
            <NavLink to="/" onClick={() => setNavOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/cars" onClick={() => setNavOpen(false)}>
              SelfDrive-Car
            </NavLink>
          </li>
          {/* Role-specific items */}
          {role === "host" &&
            hostNavItems.map((item) => (
              <li key={item.label}>
                <NavLink to={item.path}>{item.label}</NavLink>
              </li>
            ))}
          {role === "guest" &&
            guestNavItems.map((item) => (
              <li key={item.label}>
                <NavLink to={item.path}>{item.label}</NavLink>
              </li>
            ))}
          <li>
            <NavLink to="/community" onClick={() => setNavOpen(false)}>
              Community
            </NavLink>
          </li>
        </ul>

        {/* Profile */}
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
                  {profileDropdownItems.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() =>
                        item.action ? item.action() : navigate(item.path)
                      }
                    >
                      {item.label}
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
