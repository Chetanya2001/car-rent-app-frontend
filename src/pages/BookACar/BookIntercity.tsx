import { useLocation, Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function BookIntercity() {
  const { state } = useLocation();

  if (!state || state.tripType !== "intercity") {
    return <Navigate to="/" replace />;
  }

  const {
    carId,
    pickupCity,
    pickupLocation,
    dropCity,
    pickupDate,
    pickupTime,
    pax,
    luggage,
  } = state;

  return (
    <>
      <Navbar />

      <div className="book-car-container">
        <div className="car-details-section">
          <h1>Intercity Trip</h1>
          <p>Car ID: {carId}</p>
          <p>
            <b>Pickup:</b> {pickupCity} – {pickupLocation}
          </p>
          <p>
            <b>Drop:</b> {dropCity}
          </p>
          <p>
            <b>Date:</b> {pickupDate} {pickupTime}
          </p>
          <p>
            <b>PAX:</b> {pax} | <b>Luggage:</b> {luggage}
          </p>

          <p style={{ color: "green" }}>Driver & Insurance Included</p>
        </div>
      </div>

      <Footer />
    </>
  );
}
