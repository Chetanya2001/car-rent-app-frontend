import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import ChargesCard from "../../components/ChargesCard/ChargesCard";
import CarTabs from "../../components/CarTabs/CarsTab";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import LocationPicker from "../../components/Map/LocationPicker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import { getCarDetails } from "../../services/carDetails";
import { getCarLocation } from "../../services/carService";
import { bookCar } from "../../services/booking";

import { geocodeAddress } from "../../utils/geocode";
import type { CarDetailsType } from "../../types/CarDetails";

import "./BookACar.css";

const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_TOKEN;

const SelfDriveCarDetails: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Guard
  if (!state?.carId) {
    navigate("/cars", { replace: true });
    return null;
  }

  const { carId, bookingDetails = {}, carLocation } = state;

  /* -------------------- STATE -------------------- */
  const [car, setCar] = useState<CarDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedCarLocation, setFetchedCarLocation] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const now = new Date();
  now.setHours(now.getHours() + 2);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const timeNow = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [pickupDate, setPickupDate] = useState(
    bookingDetails.pickupDate || today
  );
  const [pickupTime, setPickupTime] = useState(
    bookingDetails.pickupTime || timeNow
  );
  const [dropDate, setDropDate] = useState(bookingDetails.dropDate || today);
  const [dropTime, setDropTime] = useState(bookingDetails.dropTime || timeNow);

  const [insureTrip, setInsureTrip] = useState(
    bookingDetails.insureTrip ?? false
  );
  const [driverRequired, setDriverRequired] = useState(
    bookingDetails.driverRequired ?? false
  );
  const [differentDrop, setDifferentDrop] = useState(
    bookingDetails.differentDrop ?? false
  );

  const [dropCity, setDropCity] = useState(bookingDetails.dropCity || "");
  const [showDropMap, setShowDropMap] = useState(false);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    const load = async () => {
      try {
        const [carData, location] = await Promise.all([
          getCarDetails(Number(carId)),
          getCarLocation(Number(carId)),
        ]);
        setCar(carData);
        setFetchedCarLocation(location);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [carId]);

  /* -------------------- PRICING ENGINE -------------------- */
  const hours = useMemo(() => {
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${dropDate}T${dropTime}`);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 36e5));
  }, [pickupDate, pickupTime, dropDate, dropTime]);

  const pricing = useMemo(() => {
    const base = (car?.price_per_hour || 100) * hours;
    const insurance = insureTrip ? 20 * hours : 0;
    const driver = driverRequired ? 150 * hours : 0;
    const drop = differentDrop ? 1000 : 0;
    const subtotal = base + insurance + driver + drop;
    const gst = Math.round(subtotal * 0.18);

    return {
      base,
      insurance,
      driver,
      drop,
      gst,
      total: subtotal + gst,
    };
  }, [car, hours, insureTrip, driverRequired, differentDrop]);
  const nextImage = () => {
    if (car?.photos?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % car.photos.length);
    }
  };

  const prevImage = () => {
    if (car?.photos?.length) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + car.photos.length) % car.photos.length
      );
    }
  };

  /* -------------------- BOOKING -------------------- */
  const handleBookNow = async () => {
    try {
      const pickupAddress = fetchedCarLocation || carLocation;
      if (!pickupAddress) throw new Error("Pickup location missing");

      if (differentDrop && !dropCity) {
        alert("Please select drop-off city");
        return;
      }

      const pickupGeo = await geocodeAddress(pickupAddress, LOCATIONIQ_KEY);
      const dropGeo = differentDrop
        ? await geocodeAddress(dropCity, LOCATIONIQ_KEY)
        : pickupGeo;
      if (!pickupGeo || !dropGeo) {
        throw new Error(
          "Unable to calculate distance: invalid pickup or drop location"
        );
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue");
        return;
      }

      const payload = {
        car_id: Number(carId),
        start_datetime: `${pickupDate}T${pickupTime}:00`,
        end_datetime: `${dropDate}T${dropTime}:00`,
        pickup_address: pickupAddress,
        pickup_lat: pickupGeo.lat,
        pickup_long: pickupGeo.lng,
        drop_address: dropCity || pickupAddress,
        drop_lat: dropGeo.lat,
        drop_long: dropGeo.lng,
        insure_amount: pricing.insurance,
        driver_amount: pricing.driver,
        total_amount: pricing.total,
      };

      const res = await bookCar(payload, token);

      alert("Booking confirmed. Pay at pickup.");
      navigate("/guest-mybookings", { state: { booking: res.booking } });
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Booking failed");
    }
  };

  /* -------------------- UI -------------------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="book-car-container">Loading...</div>
        <Footer />
      </>
    );
  }

  if (!car) return null;

  return (
    <>
      <Navbar />

      <div className="book-car-container">
        {/* LEFT */}
        <div className="car-details-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>

          <h1>
            {car.make} {car.model}
          </h1>
          {/* CAROUSEL */}
          {car.photos?.length > 0 && (
            <div className="carousel">
              <button className="prev" onClick={prevImage}>
                &#10094;
              </button>

              <img
                src={car.photos[currentImageIndex].photo_url}
                alt={`${car.make} ${car.model}`}
                className="carousel-image"
              />

              <button className="next" onClick={nextImage}>
                &#10095;
              </button>
            </div>
          )}

          <CarTabs car={car} />

          {/* TRIP */}
          <div className="trip-section">
            <h3>Zip Your Trip</h3>

            <div className="trip-inputs">
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

            <div className="trip-options">
              <div className="toggle-wrapper">
                <p className="switch-label">Insure Trip</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={insureTrip}
                    onChange={() => setInsureTrip(!insureTrip)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <p className="switch-label">Driver Required</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={driverRequired}
                    onChange={() => setDriverRequired(!driverRequired)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <p className="switch-label">Different Drop Location</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={differentDrop}
                    onChange={() => setDifferentDrop(!differentDrop)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {differentDrop && (
              <div>
                <select
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                >
                  <option value="">Select Drop City</option>
                  <option>Delhi</option>
                  <option>Noida</option>
                  <option>Gurgaon</option>
                  <option>Agra</option>
                </select>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  onClick={() => setShowDropMap(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <ChargesCard
            carCharges={pricing.base}
            insuranceCharges={pricing.insurance}
            driverCharges={pricing.driver}
            pickDropCharges={pricing.drop}
            gst={pricing.gst}
            carLocation={fetchedCarLocation}
            onPay={handleBookNow}
          />
        </div>
      </div>

      <Footer />

      {showDropMap && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              setDropCity(`${loc.city || ""} ${loc.state || ""}`.trim());
              setShowDropMap(false);
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default SelfDriveCarDetails;
