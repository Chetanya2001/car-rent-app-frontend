import { useEffect, useState } from "react";
import "./Home.css";
import logo from "../../assets/logo.png";
import backgroundImage from "../../assets/bg_1.jpg";
import pickupIcon from "../../assets/smart-transportation.png";
import bestdealIcon from "../../assets/communication.png";
import carrentIcon from "../../assets/car-rent.png";
import aboutImage from "../../assets/bg_3.jpg";
import Testimonials from "../../components/Testimonials/Testimonial";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

export default function Home() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const header = document.querySelector(".home-header") as HTMLElement;

    const handleScroll = () => {
      if (header) {
        const headerBottom = header.offsetTop + header.offsetHeight;
        setShowNavbar(window.scrollY > headerBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
      <header className="home-header">
        <img src={logo} alt="Logo" className="home-logo" />
        <nav className="home-nav">
          <a href="#home">Home</a>
          <a href="#about">Cars</a>
          <a href="#services">Community</a>
          <a href="#contact">Support</a>
        </nav>
      </header>

      {/* ✅ Navbar (only appears after scrolling past header) */}
      {showNavbar && <Navbar />}

      {/* Hero Section */}
      <div className="hero-wrapper">
        <div className="home-overlay"></div>
        <div className="home-hero">
          <h1>Fast & Easy Way To Lease A Self Drive Car</h1>
          <p>
            Zip drive your way with reliable and comfortable cars from our
            trusted hosts. Backed by roadside assistance and strong customer
            service, we make sure you get the best possible experience both on &
            off the road.
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

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-left"></div>
        <div className="about-right">
          <h4>ABOUT US</h4>
          <h2>Welcome to Zipdrive</h2>
          <p>
            Zip drive your way with reliable and comfortable cars from our
            trusted hosts. With strong customer centric focus, we make sure you
            get the best possible experience both on & off the road.
          </p>
          <p>
            We are not just car aggregators. We provide array of solutions
            including your trip insurance, road side assistance and accidental
            repairs through our partner network. Our service offerings include
            driver provisioning if case you need one.
          </p>
          <p>
            You may also reach us via <b>support@zipdrive.in</b> for customised
            travel arrangements like group travel.
          </p>
          <button className="about-btn">Search Vehicle</button>
        </div>
        <div className="about-image">
          <img src={aboutImage} alt="About Zipdrive" />
        </div>
      </section>

      {/* Why Zipdrive Section */}
      <section className="why-section" id="why">
        <h4>WHY ZIPDRIVE ?</h4>
        <h2>
          Cos we deliver not just a car <br /> but our promise !
        </h2>

        <div className="why-features">
          <div className="why-item">
            <div className="why-icon">🚗</div>
            <h5>100% Fulfillment</h5>
            <p>
              When we undertake a booking, we are committed to serve. We have
              zero charges for timely cancellations.
            </p>
          </div>
          <div className="why-item">
            <div className="why-icon">🚌</div>
            <h5>Intercity Service</h5>
            <p>
              First in the pack to provide Pickup & DropOff across cities.
              Example: Delhi to Agra or vice-versa.
            </p>
          </div>
          <div className="why-item">
            <div className="why-icon">🚙</div>
            <h5>Spick & Span cars</h5>
            <p>
              Cars we provide are neat, clean and well serviced with exhaustive
              checklists for best health & condition.
            </p>
          </div>
          <div className="why-item">
            <div className="why-icon">🏠</div>
            <h5>Airports & Home</h5>
            <p>
              We provide cars at airports, railway stations, your home or other
              agreed locations at nominal costs.
            </p>
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section
        className="host-section"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="host-overlay"></div>
        <div className="host-content">
          <h2>
            Hello Car Owners, <br />
            You can earn with us !
          </h2>
          <p>
            Put your idle car to work and let it make some money for you. Safe &
            reliable renting through use of technology, experience and strong
            verification. Learn more about our host program.
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
