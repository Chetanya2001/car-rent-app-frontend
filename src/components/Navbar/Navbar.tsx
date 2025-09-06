import logo from "../../assets/logo.png";
import "./Navbar.css";
export default function Navbar() {
  return (
    <nav className="scroll-navbar">
      <div className="scroll-navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="scroll-navbar-links">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#about">Cars</a>
        </li>
        <li>
          <a href="#services">Community</a>
        </li>
        <li>
          <a href="#contact">Support</a>
        </li>
      </ul>
    </nav>
  );
}
