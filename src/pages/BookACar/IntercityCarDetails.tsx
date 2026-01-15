import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarTabs from "../../components/CarTabs/CarsTab";
import IntercityChargesCard from "../../components/ChargesCard/IntercityChargesCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getCarDetails } from "../../services/carDetails";
import { bookCar } from "../../services/booking";
import type { CarDetailsType } from "../../types/CarDetails";
import "./BookACar.css";

const GST_RATE = 0.18;

const IntercityCarDetails: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.carId) {
    navigate("/intercity-cars", { replace: true });
    return null;
  }

  const {
    carId,
    pickupCity,
    pickupLocation,
    dropLocation,
    tripDistanceKm,
    insureTrip = true,
    dropCity,
    pricePerKm,
  } = state;

  const [car, setCar] = useState<CarDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const carData = await getCarDetails(Number(carId));
        setCar(carData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [carId]);

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

  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to continue");
        return;
      }

      // Calculate pricing
      const baseFare = Math.round(tripDistanceKm * (pricePerKm || 0));
      const insurance = insureTrip ? Math.round(tripDistanceKm * 1.5) : 0;
      const subTotal = baseFare + insurance;
      const gst = Math.round(subTotal * GST_RATE);
      const total = subTotal + gst;

      const payload = {
        car_id: Number(carId),
        start_datetime: new Date().toISOString(),
        end_datetime: new Date().toISOString(),
        pickup_address: `${pickupLocation}, ${pickupCity}`,
        pickup_lat: 0,
        pickup_long: 0,
        drop_address: `${dropLocation?.address || ""}, ${dropCity || ""}`,
        drop_lat: dropLocation?.lat || 0,
        drop_long: dropLocation?.lng || 0,
        insure_amount: insurance,
        driver_amount: 0,
        total_amount: total,
      };

      const res = await bookCar(payload, token);

      alert("Intercity booking confirmed! Pay at pickup.");
      navigate("/guest-mybookings", { state: { booking: res.booking } });
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="book-car-container">
          <div className="loading-spinner">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!car) return null;

  return (
    <>
      <Navbar />

      <div className="book-car-container">
        {/* LEFT SECTION - Car details */}
        <div className="car-details-section">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>

          <h1 className="car-title">
            {car.make} {car.model}
          </h1>

          {car.photos?.length > 0 && (
            <div className="carousel">
              <img
                src={car.photos[currentImageIndex].photo_url}
                alt={car.model}
                className="carousel-image"
              />
              <button className="prev" onClick={prevImage}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button className="next" onClick={nextImage}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}

          <CarTabs car={car} />
        </div>

        {/* RIGHT SECTION - Intercity Charges Card */}
        <div className="booking-section">
          <IntercityChargesCard
            pickupStation={pickupLocation || ""}
            pickupCity={pickupCity || ""}
            dropAddress={dropLocation?.address || ""}
            dropCity={dropCity || dropLocation?.city || ""}
            tripKm={tripDistanceKm || 0}
            pricePerKm={car.price_per_km || 0}
            insureTrip={insureTrip}
            onPay={handleBookNow}
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default IntercityCarDetails;
