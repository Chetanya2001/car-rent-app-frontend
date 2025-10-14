import { useState, useEffect } from "react";
import ChargesCard from "../../components/ChargesCard/ChargesCard";
import "./BookACar.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { getCarDetails } from "../../services/carDetails";
import type { CarDetailsType } from "../../types/CarDetails";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import LocationPicker from "../../components/Map/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const BookACar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get all state passed from Cars component
  const {
    carId,
    pricePerHour: routedPricePerHour,
    bookingDetails,
    carLocation, // 🟢 added this field from Cars page
  } = location.state || {};

  // Log state data for debugging
  console.log("📦 State received from Cars component:", location.state);

  // Car details state
  const [car, setCar] = useState<CarDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  now.setHours(now.getHours() + 2);

  const pad = (num: string | number) => (Number(num) < 10 ? "0" + num : num);
  const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [pickupDate, setPickupDate] = useState(
    bookingDetails?.pickupDate || currentDate
  );
  const [pickupTime, setPickupTime] = useState(
    bookingDetails?.pickupTime || currentTime
  );
  const [dropDate, setDropDate] = useState(
    bookingDetails?.dropDate || currentDate
  );
  const [dropTime, setDropTime] = useState(
    bookingDetails?.dropTime || currentTime
  );
  const [insureTrip, setInsureTrip] = useState(
    bookingDetails?.insureTrip ?? false
  );
  const [driverRequired, setDriverRequired] = useState(
    bookingDetails?.driverRequired ?? false
  );
  const [differentDrop, setDifferentDrop] = useState(
    bookingDetails?.differentDrop ?? false
  );

  const [dropCity, setDropCity] = useState<string>(
    bookingDetails?.dropCity || ""
  );
  const [showDropMap, setShowDropMap] = useState(false);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) {
        navigate("/cars");
        return;
      }
      try {
        const carData = await getCarDetails(Number(carId));
        setCar(carData);
      } catch (err) {
        console.error("Error fetching car details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [carId, navigate]);

  const pricePerHour = car?.price_per_hour ?? routedPricePerHour ?? 100;

  let hours = 1;
  if (pickupDate && dropDate && pickupTime && dropTime) {
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropDate}T${dropTime}`);
    hours = Math.max(
      1,
      Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60))
    );
  }

  const carCharges = pricePerHour * hours;
  const insuranceCharges = insureTrip ? 20 * hours : 0;
  const driverCharges = driverRequired ? 150 * hours : 0;
  const pickDropCharges = differentDrop ? 1000 : 0;
  const subTotal =
    carCharges + insuranceCharges + driverCharges + pickDropCharges;
  const gst = Math.round(subTotal * 0.18);

  const photos = car?.photos?.map((p) => p.photo_url) || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % photos.length);
  const prevImage = () =>
    setCurrentImageIndex((i) => (i - 1 + photos.length) % photos.length);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="book-car-container">Loading...</div>
        <Footer />
      </>
    );

  if (!car)
    return (
      <>
        <Navbar />
        <div className="book-car-container">No car found.</div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="book-car-container">
        {/* Left Section */}
        <div className="car-details-section">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            &#8592;
          </button>

          <div className="breadcrumb">
            {car.make} {car.model}
          </div>
          <h1 className="car-title">
            {car.make} {car.model}
          </h1>

          {photos.length > 0 && (
            <div className="carousel">
              <button className="prev" onClick={prevImage}>
                &#10094;
              </button>
              <img
                src={photos[currentImageIndex]}
                alt={`Car ${currentImageIndex + 1}`}
                className="carousel-image"
              />
              <button className="next" onClick={nextImage}>
                &#10095;
              </button>
            </div>
          )}

          <div className="about-section-1">
            <h3>About this car</h3>
            <p>{car.description ?? "No description available."}</p>
          </div>

          {/* Trip Section */}
          <div className="trip-section">
            <h3>Zip Your Trip</h3>
            <div className="trip-inputs">
              <div>
                <label>Pick-up Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div>
                <label>Pick-up Time</label>
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
              </div>
              <div>
                <label>Drop-off Time</label>
                <input
                  type="time"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                />
              </div>
            </div>

            <div className="trip-options">
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
                <span className="switch-label">
                  Different Drop-off Location
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={differentDrop}
                    onChange={() => setDifferentDrop(!differentDrop)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            {differentDrop && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <select
                    value={dropCity}
                    onChange={(e) => setDropCity(e.target.value)}
                    style={{ flex: 1, padding: "6px", fontSize: "1rem" }}
                    title="Select drop-off city"
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
                    style={{ marginLeft: 8, cursor: "pointer" }}
                    onClick={() => setShowDropMap(true)}
                    title="Select location on map"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Right Section: Charges Summary */}
        <div className="right-section">
          <ChargesCard
            carCharges={carCharges}
            insuranceCharges={insuranceCharges}
            driverCharges={driverCharges}
            pickDropCharges={pickDropCharges}
            gst={gst}
            carLocation={carLocation}
            onPay={() => alert("Proceeding to payment...")}
          />
        </div>
      </div>

      <Footer />

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
    </>
  );
};

export default BookACar;
