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
  // faCalendarAlt,
  // faLifeRing,
  // faDoorOpen,
  // faPlus,
  // faFile,
} from "@fortawesome/free-solid-svg-icons";

import { searchCars } from "../../services/carService";
import { fetchUserProfile } from "../../services/auth";
import LocationPicker from "../../components/Map/LocationPicker";

type TokenPayload = { role: "host" | "guest" | "admin" };

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(
    null
  );
  const [role, setRole] = useState<"host" | "guest" | "admin" | null>(null);
  const [, setShowMenu] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);
  const [dropCity, setDropCity] = useState("");
  const [pickupLocation, setPickupLocation] = useState<{
    address: string;
    city?: string;
    state?: string;
    country?: string;
    lat?: number;
    lng?: number;
  } | null>(null);

  // Booking form state
  const [city, setCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [insureTrip, setInsureTrip] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);
  const [differentDrop, setDifferentDrop] = useState(false);
  const [showPickupOptions, setShowPickupOptions] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilePicUrl");
    setUser(null);
    setRole(null);
    setShowMenu(false);
    navigate("/");
  };

  // Init: check token & fetch profile safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedProfilePic = localStorage.getItem("profilePicUrl");

    if (storedProfilePic) setProfilePicUrl(storedProfilePic);
    if (storedUser) setUser(JSON.parse(storedUser));

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);

        fetchUserProfile(token)
          .then((data) => {
            setUser(data);
            if (data.profile_pic) {
              setProfilePicUrl(data.profile_pic);
              localStorage.setItem("profilePicUrl", data.profile_pic);
            }
          })
          .catch((err) => {
            if (err.response?.status === 403) {
              // Invalid or expired token
              handleLogout();
            } else {
              console.error("Profile fetch error:", err);
            }
          });
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout();
      }
    }
  }, []);
  const formatDisplayAddress = (address: string) => {
    if (!address) return "";

    // Keep natural order, just trim extra spaces
    return address.replace(/\s+/g, " ").trim();
  };

  // Check URL for showLogin param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showLogin") === "true") {
      setActiveModal("login");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  // Set default pickup/drop time
  useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours() + 2);
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setPickupTime(currentTime);
    setDropTime(currentTime);
  }, []);

  // Search cars safely
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
            dropCity,
          },
        },
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("Session expired. Please login again.");
        handleLogout();
      } else {
        console.error("Error searching cars:", err);
        alert("Failed to fetch cars. Try again.");
      }
    }
  };

  // // Menu items
  // const hostMenu = ["Add a Car", "My Cars", "My Bookings", "Logout"];
  // const guestMenu = ["Book a Car", "My Bookings", "My Documents", "Logout"];
  // const adminMenu = [
  //   "Cars",
  //   "Bookings",
  //   "Guests",
  //   "Hosts",
  //   "Payments",
  //   "Support",
  //   "Logout",
  // ];
  // const menuItems =
  //   role === "host"
  //     ? hostMenu
  //     : role === "guest"
  //     ? guestMenu
  //     : role === "admin"
  //     ? adminMenu
  //     : [];

  // const iconMap: Record<string, any> = {
  //   "Add a Car": faPlus,
  //   "My Cars": faCar,
  //   "My Bookings": faCalendarAlt,
  //   "Book a Car": faCar,
  //   "My Documents": faFile,
  //   Logout: faDoorOpen,
  //   Support: faLifeRing,
  // };

  return (
    <div className="home-container">
      {/* Transparent Navbar */}
      <header className="home-header transparent">
        <img src={logo} alt="Logo" className="home-logo" />

        <div
          className="hamburger"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          {isNavOpen ? "✖" : "☰"}
        </div>

        <nav className={`home-nav ${isNavOpen ? "active" : ""}`}>
          {/* HOME always visible */}
          <Link to="/" onClick={() => setIsNavOpen(false)}>
            Home
          </Link>

          {/* ---------------- PUBLIC (NOT LOGGED IN) ---------------- */}
          {!user && (
            <>
              <Link to="/searched-cars" onClick={() => setIsNavOpen(false)}>
                SelfDrive
              </Link>
              <Link to="/intercity-cars" onClick={() => setIsNavOpen(false)}>
                Intercity
              </Link>
              <Link to="/community" onClick={() => setIsNavOpen(false)}>
                Community
              </Link>
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
            </>
          )}

          {/* ---------------- HOST ---------------- */}
          {user && role === "host" && (
            <>
              <Link to="/add-car" onClick={() => setIsNavOpen(false)}>
                Add a Car
              </Link>
              <Link to="/host-mybookings" onClick={() => setIsNavOpen(false)}>
                My Bookings
              </Link>
              <Link to="/support" onClick={() => setIsNavOpen(false)}>
                Support
              </Link>
              <Link to="/my-documents" onClick={() => setIsNavOpen(false)}>
                Profile
              </Link>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </>
          )}

          {/* ---------------- GUEST ---------------- */}
          {user && role === "guest" && (
            <>
              <Link to="/searched-cars" onClick={() => setIsNavOpen(false)}>
                Book a Car
              </Link>
              <Link to="/guest-mybookings" onClick={() => setIsNavOpen(false)}>
                My Bookings
              </Link>
              <Link to="/support" onClick={() => setIsNavOpen(false)}>
                Support
              </Link>
              <Link to="/my-documents" onClick={() => setIsNavOpen(false)}>
                Profile
              </Link>
              <Link to="/" onClick={handleLogout}>
                Logout
              </Link>
            </>
          )}
        </nav>

        {/* Avatar (visual only) */}
        {user && (
          <img
            src={profilePicUrl || user.avatar || defaultAvatar}
            alt="Profile"
            className="profile-avatar"
          />
        )}
      </header>

      {/* Login/Register Modals */}
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
                    setRole(jwtDecode<TokenPayload>(token).role);
                  } catch {}
                }
              }}
              remark={remark}
            />
          ) : (
            <Register
              onClose={() => setActiveModal(null)}
              onSwitch={() => setActiveModal("login")}
              onRegisterSuccess={() => {
                setRemark("Verification link sent. Complete to enable login");
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
              placeholder="Click to select pickup location"
              value={
                pickupLocation
                  ? formatDisplayAddress(pickupLocation.address)
                  : ""
              }
              readOnly={!pickupLocation}
              onClick={() => {
                if (!pickupLocation) {
                  setShowPickupOptions(true); // open the new options modal
                }
              }}
              onChange={(e) => {
                if (pickupLocation) {
                  setPickupLocation({
                    ...pickupLocation,
                    address: e.target.value,
                  });
                }
              }}
              title={pickupLocation?.address} // hover shows full address
              style={{
                flexGrow: 1,
                cursor: pickupLocation ? "text" : "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />

            {!pickupLocation && (
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{ marginLeft: "8px", cursor: "pointer" }}
                onClick={() => setShowPickupMap(true)}
              />
            )}
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
              setPickupLocation(loc);
              setCity(loc.city || loc.state || "");
              setShowPickupMap(false);
            }}
          />
        </ModalWrapper>
      )}
      {showDropMap && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              setPickupLocation(loc);
              setCity(loc.city || loc.state || "");
              setShowPickupMap(false);
            }}
          />
        </ModalWrapper>
      )}
      {/* PICKUP OPTIONS MODAL */}
      {showPickupOptions && (
        <ModalWrapper onClose={() => setShowPickupOptions(false)}>
          <div className="location-modal-overlay">
            <div className="location-modal">
              <div className="location-modal-header">
                <h2>Select Pickup Location</h2>
                <p>Choose how you'd like to set your pickup address</p>
              </div>

              <div className="location-modal-body">
                <button
                  className="location-option-btn current-location"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;

                        const res = await fetch(
                          `https://us1.locationiq.com/v1/reverse?key=${
                            import.meta.env.VITE_LOCATIONIQ_TOKEN
                          }&lat=${lat}&lon=${lng}&format=json`
                        );
                        const data = await res.json();

                        setPickupLocation({
                          address: data.display_name,
                          city: data.address.city || data.address.town || "",
                          state: data.address.state || "",
                          country: data.address.country || "",
                          lat,
                          lng,
                        });

                        setShowPickupOptions(false);
                      },
                      () => alert("Location permission denied")
                    );
                  }}
                >
                  <div className="option-icon">📍</div>
                  <div className="option-content">
                    <h3>Use Current Location</h3>
                    <p>Automatically detect your current position</p>
                  </div>
                </button>

                <button
                  className="location-option-btn map-location"
                  onClick={() => {
                    setShowPickupOptions(false);
                    setShowPickupMap(true);
                  }}
                >
                  <div className="option-icon">🗺️</div>
                  <div className="option-content">
                    <h3>Pick on Map</h3>
                    <p>Choose a location by browsing the map</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      <style>{`
        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .location-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .location-modal-header {
          background: linear-gradient(135deg, #01d28e 0%, #018f61 100%);
          color: white;
          padding: 32px 24px;
          text-align: center;
        }

        .location-modal-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .location-modal-header p {
          margin: 0;
          font-size: 14px;
          opacity: 0.95;
          font-weight: 400;
        }

        .location-modal-body {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fafafa;
        }

        .location-option-btn {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .location-option-btn:hover {
          border-color: #01d28e;
          background: #f0fdf7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(1, 210, 142, 0.2);
        }

        .location-option-btn:active {
          transform: translateY(0);
        }

        .option-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf7;
          border-radius: 12px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .location-option-btn:hover .option-icon {
          background: #01d28e;
          transform: scale(1.1);
        }

        .option-content {
          flex: 1;
        }

        .option-content h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .option-content p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }

        @media (max-width: 600px) {
          .location-modal {
            max-width: 100%;
            margin: 0 10px;
          }

          .location-modal-header {
            padding: 24px 20px;
          }

          .location-modal-header h2 {
            font-size: 20px;
          }

          .location-modal-header p {
            font-size: 13px;
          }

          .location-modal-body {
            padding: 20px 16px;
          }

          .location-option-btn {
            padding: 16px;
            gap: 16px;
          }

          .option-icon {
            width: 50px;
            height: 50px;
            font-size: 26px;
          }

          .option-content h3 {
            font-size: 16px;
          }

          .option-content p {
            font-size: 13px;
          }
        }
          
      `}</style>
    </div>
  );
}
