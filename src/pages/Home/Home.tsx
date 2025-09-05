import "./Home.css";
import logo from "../../assets/logo.png";
import backgroundImage from "../../assets/bg_1.jpg";
import pickupIcon from "../../assets/smart-transportation.png";
import bestdealIcon from "../../assets/communication.png";
import carrentIcon from "../../assets/car-rent.png";

export default function Home() {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="home-overlay"></div>

      {/* Header */}
      <header className="home-header">
        <img src={logo} alt="Logo" className="home-logo" />
        <nav className="home-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="home-hero">
        <h1>Fast & Easy Way To Lease A Self Drive Car</h1>
        <p>
          Zip drive your way with reliable and comfortable cars from our trusted
          hosts. Backed by roadside assistance and strong customer service, we
          make sure you get the best possible experience both on & off the road.
        </p>

        {/* Play Button */}
        <div className="home-play">
          <button className="home-play-button">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
          <span className="home-play-text">Easy steps for renting a car</span>
        </div>
      </div>

      {/* Booking Section */}
      <div className="booking-section">
        {/* Form */}
        <div className="booking-box">
          <h2>Zip your Trip</h2>

          <label>Pick-up Location</label>
          <input type="text" placeholder="City, Airport, Station, etc" />

          <div className="date-time">
            <div>
              <label>Pick-up Date</label>
              <input type="date" />
              <input type="time" />
            </div>
            <div>
              <label>Drop-off Date</label>
              <input type="date" />
              <input type="time" />
            </div>
          </div>

          <div className="toggles">
            <label>
              Insure Trip: <input type="checkbox" />
            </label>
            <label>
              Driver Required: <input type="checkbox" />
            </label>
            <label>
              Different Drop-off Location: <input type="checkbox" />
            </label>
          </div>

          <button className="search-btn">Search</button>
        </div>

        {/* Info */}
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
    </div>
  );
}
