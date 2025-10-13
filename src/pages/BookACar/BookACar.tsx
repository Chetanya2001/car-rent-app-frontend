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
  // Get navigation state
  const location = useLocation();
  const navigate = useNavigate();
  const {
    carId,
    pricePerHour: routedPricePerHour,
    bookingDetails,
  } = location.state || {};

  // Car details state
  const [car, setCar] = useState<CarDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  now.setHours(now.getHours() + 2); // Add 2 hours

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

  // New state for the different drop-off location input and modal
  const [dropCity, setDropCity] = useState<string>(
    bookingDetails?.dropCity || ""
  );
  const [showDropMap, setShowDropMap] = useState(false);

  // Fetch car details when carId changes
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!carId) {
        navigate("/cars"); // No car selected, back to listing
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

  // Calculation for pricing
  const pricePerHour = car?.price_per_hour ?? routedPricePerHour ?? 100;
  let carCharges = 0,
    insuranceCharges = 0,
    driverCharges = 0,
    pickDropCharges = 0,
    gst = 0;

  let hours = 1;
  if (pickupDate && dropDate && pickupTime && dropTime) {
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropDate}T${dropTime}`);
    hours = Math.max(
      1,
      Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60))
    );
  }
  carCharges = pricePerHour * hours;
  insuranceCharges = insureTrip ? 20 * hours : 0;
  driverCharges = driverRequired ? 150 * hours : 0;
  pickDropCharges = differentDrop ? 1000 : 0;
  const subTotal =
    carCharges + insuranceCharges + driverCharges + pickDropCharges;
  gst = Math.round(subTotal * 0.18);

  // Images
  const photos = car?.photos?.map((p) => p.photo_url) || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % photos.length);
  const prevImage = () =>
    setCurrentImageIndex((i) => (i - 1 + photos.length) % photos.length);

  // Handler for dropCity input change

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
        {/* Left Section: Car Details */}
        <div className="car-details-section">
          <div className="breadcrumb">
            {car.make} {car.model}
          </div>
          <h1 className="car-title">
            {car.make} {car.model}
          </h1>
          {/* Image Carousel */}
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
          {/* About Section */}
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

            {/* Drop-off Location input and map icon if differentDrop is true */}
            {differentDrop && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <select
                    value={dropCity}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setDropCity(e.target.value)
                    }
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
        {/* Right Section: Charges Summary */}
        <div className="right-section">
          <ChargesCard
            carCharges={carCharges}
            insuranceCharges={insuranceCharges}
            driverCharges={driverCharges}
            pickDropCharges={pickDropCharges}
            gst={gst}
            onPay={() => alert("Proceeding to payment...")}
          />
        </div>
      </div>
      <Footer />

      {/* Drop-off Map Modal */}
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
