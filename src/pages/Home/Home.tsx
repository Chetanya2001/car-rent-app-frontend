import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Home.css";
import logo from "../../assets/logo.png";
import pickupIcon from "../../assets/smart-transportation.png";
import bestdealIcon from "../../assets/communication.png";
import carrentIcon from "../../assets/car-rent.png";
import aboutImage from "../../assets/bg_3.jpg";
import defaultAvatar from "../../assets/user.png";
import Testimonials from "../../components/Testimonials/Testimonial";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import Login from "../auth/Login/Login";
import Register from "../auth/Register/Register";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import { Link, useNavigate } from "react-router-dom";

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

import { searchCars } from "../../services/carService"; // ✅ Import API

type TokenPayload = {
  role: "host" | "guest";
};

export default function Home() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(
    null
  );
  const [role, setRole] = useState<"host" | "guest" | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Booking form state
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [insureTrip, setInsureTrip] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);
  const [differentDrop, setDifferentDrop] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    setShowMenu(false);
  };

  const handleSearch = async () => {
    if (!city || !pickupDate || !dropDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await searchCars({
        city,
        pickup_datetime: pickupDate,
        dropoff_datetime: dropDate,
      });

      console.log("✅ Cars fetched from API:", data.cars);
      console.log("🔹 Extra Booking Info:", {
        insureTrip,
        driverRequired,
        differentDrop,
      });

      // 👉 Send everything in state
      navigate("/searched-cars", {
        state: {
          cars: data.cars,
          bookingDetails: {
            city,
            pickupDate,
            pickupTime,
            dropDate,
            dropTime,
            insureTrip,
            driverRequired,
            differentDrop,
          },
        },
      });
    } catch (err) {
      console.error("❌ Error searching cars:", err);
      alert("Failed to fetch cars. Try again.");
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token");
      }
    }

    // ✅ set default current time for pickup & drop
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;

    setPickupTime(currentTime);
    setDropTime(currentTime);
  }, []);

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
  const menuItems = role === "host" ? hostMenu : guestMenu;

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

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        {/* Logo */}
        <img src={logo} alt="Logo" className="home-logo" />

        {/* Hamburger (mobile only) */}
        <div
          className="hamburger"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          {isNavOpen ? "✖" : "☰"}
        </div>

        {/* Navigation */}
        <nav className={`home-nav ${isNavOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsNavOpen(false)}>
            Home
          </Link>
          <Link to="/cars" onClick={() => setIsNavOpen(false)}>
            Cars
          </Link>
          <a href="#services" onClick={() => setIsNavOpen(false)}>
            Community
          </a>
          <a href="#contact" onClick={() => setIsNavOpen(false)}>
            Support
          </a>

          {!user ? (
            <a
              href="#login"
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                setIsNavOpen(false);
                setActiveModal("login");
              }}
            >
              Login
            </a>
          ) : (
            <div
              className="user-profile"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <img
                src={user.avatar || defaultAvatar}
                alt="Profile"
                className={`profile-avatar ${
                  !user.avatar ? "default-avatar" : ""
                }`}
              />
              {showMenu && (
                <ul className="profile-menu">
                  {menuItems.map((item, idx) => {
                    if (item === "Logout") {
                      return (
                        <li key={idx} onClick={handleLogout}>
                          <FontAwesomeIcon
                            icon={iconMap[item]}
                            className="menu-icon"
                          />{" "}
                          {item}
                        </li>
                      );
                    }

                    if (item === "Add a Car") {
                      return (
                        <li key={idx} onClick={() => navigate("/add-car")}>
                          <FontAwesomeIcon
                            icon={iconMap[item]}
                            className="menu-icon"
                          />{" "}
                          {item}
                        </li>
                      );
                    }

                    if (item === "My Cars") {
                      return (
                        <li key={idx} onClick={() => navigate("/my-cars")}>
                          <FontAwesomeIcon
                            icon={iconMap[item]}
                            className="menu-icon"
                          />{" "}
                          {item}
                        </li>
                      );
                    }

                    return (
                      <li key={idx}>
                        <FontAwesomeIcon
                          icon={iconMap[item]}
                          className="menu-icon"
                        />{" "}
                        {item}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Modal */}
      {activeModal && (
        <ModalWrapper onClose={() => setActiveModal(null)}>
          {activeModal === "login" ? (
            <Login
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("register")}
              onLoginSuccess={(userData) => {
                setUser(userData);
                setActiveModal(null);
                const token = localStorage.getItem("token");
                if (token) {
                  try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    setRole(decoded.role);
                  } catch (err) {
                    console.error("Invalid token after login");
                  }
                }
              }}
            />
          ) : (
            <Register
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("login")}
              onRegisterSuccess={(userData) => {
                setUser(userData);
                setActiveModal(null);
                const token = localStorage.getItem("token");
                if (token) {
                  try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    setRole(decoded.role);
                  } catch (err) {
                    console.error("Invalid token after register");
                  }
                }
              }}
            />
          )}
        </ModalWrapper>
      )}

      {/* Hero */}
      <div className="hero-wrapper">
        <div className="home-overlay"></div>
        <div className="home-hero">
          <h1>Fast & Easy Way To Lease A Self Drive Car</h1>
          <p>
            Zip drive your way with reliable and comfortable cars from our
            trusted hosts.
          </p>
          <div className="home-play">
            <button className="home-play-button">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span className="home-play-text">Easy steps for renting a car</span>
          </div>
        </div>
      </div>

      {/* Booking */}
      <div className="booking-section">
        <div className="booking-box">
          <h2>Zip your Trip</h2>
          <label>Pick-up Location</label>
          <input
            type="text"
            placeholder="City, Airport, Station, etc"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className="date-time">
            <div>
              <label>Pick-up Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            <div>
              <label>Drop-off Date</label>
              <input
                type="date"
                value={dropDate}
                onChange={(e) => setDropDate(e.target.value)}
              />
              <input
                type="time"
                value={dropTime}
                onChange={(e) => setDropTime(e.target.value)}
              />
            </div>
          </div>

          <div className="toggle-wrapper">
            <span className="switch-label">Insure Trip</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={insureTrip}
                onChange={() => setInsureTrip(!insureTrip)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-wrapper">
            <span className="switch-label">Driver Required</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={driverRequired}
                onChange={() => setDriverRequired(!driverRequired)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-wrapper">
            <span className="switch-label">Different Drop-off Location</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={differentDrop}
                onChange={() => setDifferentDrop(!differentDrop)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="info-box">
          <h2>Better Way to Rent Your Perfect Cars</h2>
          <div className="info-steps">
            <div>
              <img
                src={pickupIcon}
                alt="Pickup Location"
                className="info-icon"
              />
              <h5>Choose Your Pickup Location</h5>
            </div>
            <div>
              <img src={bestdealIcon} alt="Best Deal" className="info-icon" />
              <h5>Select the Best Deal</h5>
            </div>
            <div>
              <img src={carrentIcon} alt="Reserve Car" className="info-icon" />
              <h5>Reserve Your Rental Car</h5>
            </div>
          </div>
          <button className="reserve-btn">Reserve Your Perfect Car</button>
        </div>
      </div>

      {/* About */}
      <section className="about-section" id="about">
        <div className="about-left"></div>
        <div className="about-right">
          <h4>ABOUT US</h4>
          <h2>Welcome to Zipdrive</h2>
          <p>Reliable and comfortable cars from trusted hosts.</p>
          <p>Trip insurance, roadside assistance, driver provisioning.</p>
          <p>
            Contact: <b>support@zipdrive.in</b>
          </p>
          <button
            className="about-btn"
            onClick={() => navigate("/searched-cars")}
          >
            Search Vehicle
          </button>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Zipdrive" />
        </div>
      </section>

      {/* Why */}
      <section className="why-section" id="why">
        <h4>WHY ZIPDRIVE ?</h4>
        <h2>Cos we deliver not just a car but our promise !</h2>
        <div className="why-features">
          <div className="why-item">
            <div className="why-icon">
              <FontAwesomeIcon icon={faCar} />
            </div>
            <h5>100% Fulfillment</h5>
            <p>Timely service with zero cancellation charges.</p>
          </div>
          <div className="why-item">
            <div className="why-icon">
              <FontAwesomeIcon icon={faCar} />
            </div>
            <h5>Intercity Service</h5>
            <p>Pickup & DropOff across cities (e.g., Delhi ↔ Agra).</p>
          </div>
          <div className="why-item">
            <div className="why-icon">
              <FontAwesomeIcon icon={faCar} />
            </div>
            <h5>Spick & Span Cars</h5>
            <p>Neat, clean, fully serviced cars with checklists.</p>
          </div>
          <div className="why-item">
            <div className="why-icon">
              <FontAwesomeIcon icon={faCar} />
            </div>
            <h5>Airports & Home</h5>
            <p>
              Cars delivered to airports, stations, home, or agreed location.
            </p>
          </div>
        </div>
      </section>

      {/* Host */}
      <section
        className="host-section"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="host-overlay"></div>
        <div className="host-content">
          <h2>Hello Car Owners, You can earn with us!</h2>
          <p>
            Put your idle car to work. Safe & reliable renting through
            technology and verification.
          </p>
          <button className="host-btn">Become A Host</button>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Stats */}
      <Stats />

      {/* Footer */}
      <Footer />
    </div>
  );
}
