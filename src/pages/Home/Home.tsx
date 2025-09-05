import "./Home.css";
import logo from "../../assets/logo.png";
import backgroundImage from "../../assets/bg_1.jpg";

export default function Home() {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="home-overlay"></div>

      {/* Header with logo left, nav right */}
      <header className="home-header">
        <img src={logo} alt="Logo" className="home-logo" />

        <nav className="home-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Optional Hero Content */}
      <div className="home-hero">
        <h1>Fast & Easy Way To lease A Self Drive Car</h1>
        <p>
          Zip drive your way with reliable and comfortable cars from our trusted
          hosts. Backed by roadside assistance and strong customer service, we
          make sure you get the best possible experience both on & off the road.
        </p>
      </div>
      <div className="home-play">
        <button className="home-play-button">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <span className="home-play-text">Easy steps for renting a car</span>
      </div>
    </div>
  );
}
