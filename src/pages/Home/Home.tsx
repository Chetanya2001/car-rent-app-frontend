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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCar,
  faCalendarAlt,
  faCreditCard,
  faBell,
  faLifeRing,
  faDoorOpen,
  faPlus,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import LocationPicker from "../../components/Map/LocationPicker";
import { searchCars } from "../../services/carService";
import { fetchUserProfile } from "../../services/auth";

type TokenPayload = {
  role: "host" | "guest" | "admin";
};

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE ---
  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [user, setUser] = useState<{
    name?: string;
    avatar?: string;
    profile_pic?: string;
  } | null>(null);
  const [role, setRole] = useState<"host" | "guest" | "admin" | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [remark, setRemark] = useState("");

  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);

  // Booking form
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [insureTrip, setInsureTrip] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);
  const [differentDrop, setDifferentDrop] = useState(false);
  const [dropCity, setDropCity] = useState("");

  // --- MENU ---
  const hostMenu = [
    "Add a Car",
    "My Cars",
    "My Bookings",
    "My Profile",
    "Logout",
  ];
  const guestMenu = ["Book a Car", "My Bookings", "My Profile", "Logout"];
  const adminMenu = [
    "Cars",
    "Bookings",
    "Guests",
    "Hosts",
    "Payments",
    "Support",
    "Logout",
  ];

  const menuItems =
    role === "host"
      ? hostMenu
      : role === "guest"
      ? guestMenu
      : role === "admin"
      ? adminMenu
      : [];

  const iconMap: Record<string, any> = {
    "Add a Car": faPlus,
    "My Cars": faCar,
    "My Bookings": faCalendarAlt,
    "Book a Car": faCar,
    "My Profile": faFile,
    Cars: faCar,
    Guests: faCar,
    Hosts: faCar,
    Bookings: faCalendarAlt,
    Payments: faCreditCard,
    Support: faLifeRing,
    Logout: faDoorOpen,
  };

  // --- EFFECTS ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const showLogin = params.get("showLogin");
    const storedProfilePic = localStorage.getItem("profilePicUrl");
    if (storedProfilePic) setProfilePicUrl(storedProfilePic);
    if (showLogin === "true") {
      setActiveModal("login");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token", err);
      }

      fetchUserProfile(token)
        .then((profile) => {
          setUser(profile);
          if (profile.profile_pic) {
            setProfilePicUrl(profile.profile_pic);
            localStorage.setItem("profilePicUrl", profile.profile_pic);
          }
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }
  }, []);

  // --- FUNCTIONS ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
    setShowMenu(false);
    navigate("/");
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
      console.error(err);
      alert("Failed to fetch cars.");
    }
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
        navigate("/my-documents");
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
      case "Support":
        navigate("/admin/manage-support");
        break;
      case "Logout":
        handleLogout();
        break;
      default:
        break;
    }
    setShowMenu(false);
    setIsNavOpen(false);
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <img src={logo} alt="Logo" className="home-logo" />
        <div
          className="hamburger"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          {isNavOpen ? "✖" : "☰"}
        </div>
        <nav className={`home-nav ${isNavOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setIsNavOpen(false)}>
            Home
          </Link>
          <Link to="/cars" onClick={() => setIsNavOpen(false)}>
            SelfDrive-Car
          </Link>
          <Link to="/cars" onClick={() => setIsNavOpen(false)}>
            Intercity
          </Link>
          <Link to="/community" onClick={() => setIsNavOpen(false)}>
            Community
          </Link>
          {user && (
            <Link to="/support" onClick={() => setIsNavOpen(false)}>
              Support
            </Link>
          )}

          {!user ? (
            <a
              href="#login"
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                setActiveModal("login");
                setIsNavOpen(false);
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
                src={profilePicUrl || user.avatar || defaultAvatar}
                alt="Profile"
                className="profile-avatar"
              />
              {showMenu && (
                <ul className="profile-menu">
                  {menuItems.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleMenuClick(item)}
                      tabIndex={0}
                      role="menuitem"
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
        </nav>
      </header>

      {/* MODALS */}
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
              onLoginSuccess={(userData) => {
                setUser(userData);
                setActiveModal(null);
                const token = localStorage.getItem("token");
                if (token) {
                  try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    setRole(decoded.role);
                  } catch {}
                }
              }}
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
                  "Verification link sent to your email/phone. Complete the verification to enable login"
                );
                setActiveModal("login");
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="City, Airport, Station, etc"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ marginLeft: "8px", cursor: "pointer" }}
              onClick={() => setShowPickupMap(true)}
            />
          </div>

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
          {differentDrop && (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  style={{ flexGrow: 1, padding: "6px", fontSize: "1rem" }}
                >
                  <option value="" disabled>
                    Select Drop-off City
                  </option>
                  <option value="Noida">Noida</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Agra">Agra</option>
                  <option value="Meerut">Meerut</option>
                </select>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => setShowDropMap(true)}
                />
              </div>
            </>
          )}

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
      {/* Pickup Map Modal */}
      {showPickupMap && (
        <ModalWrapper onClose={() => setShowPickupMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              const locationName =
                loc.city && loc.state
                  ? `${loc.city}, ${loc.state}`
                  : loc.city || loc.state || loc.country || "";
              setCity(locationName);
              setShowPickupMap(false);
            }}
          />
        </ModalWrapper>
      )}
      {showDropMap && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              const locationName =
                loc.city && loc.state
                  ? `${loc.city}, ${loc.state}`
                  : loc.city || loc.state || loc.country || "";
              setDropCity(locationName);
              setShowDropMap(false);
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
