import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./CarDetails.css";
import type { CarDetailsType } from "../../types/CarDetails";
import { getCarDetails } from "../../services/carDetails";
import CarTabs from "../../components/CarTabs/CarsTab";
import ChargesCard from "../../components/ChargesCard/ChargesCard";
import Footer from "../../components/Footer/Footer";

interface LocationState {
  pickup_datetime: string;
  dropoff_datetime: string;
  insurance: boolean;
  driver: boolean;
  differentDrop: boolean;
  price_per_hour: number; // ✅ add this
}

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState;
  console.log("📦 State received in CarDetails:", state);

  const [car, setCar] = useState<CarDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ⏳ Calculate rental duration
  const pickup = new Date(state?.pickup_datetime);
  const dropoff = new Date(state?.dropoff_datetime);
  const hours = Math.max(
    1,
    Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60))
  );

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (id) {
          const carData = await getCarDetails(Number(id));
          setCar(carData);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  if (loading) return <p>Loading car details...</p>;
  if (!car) return <p>No car found.</p>;

  // 💰 Charges Calculation
  const hourlyRate = car?.price_per_hour || state.price_per_hour; // ✅ fallback
  const carCharges = hourlyRate * hours;

  const insuranceCharges = state.insurance ? 20 * hours : 0;
  const driverCharges = state.driver ? 150 * hours : 0;
  const pickDropCharges = state.differentDrop ? 1000 : 0;

  const subTotal =
    carCharges + insuranceCharges + driverCharges + pickDropCharges;
  const gst = Math.round(subTotal * 0.18);

  console.log("🧾 Charges Breakdown:", {
    hourlyRate,
    hours,
    carCharges,
    insuranceCharges,
    driverCharges,
    pickDropCharges,
    subTotal,
    gst,
  });
  // Image navigation
  const nextImage = () => {
    if (car.photos?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % car.photos.length);
    }
  };

  const prevImage = () => {
    if (car.photos?.length) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + car.photos.length) % car.photos.length
      );
    }
  };

  return (
    <>
      <div className="car-details-page">
        {/* Hero Section */}
        <div
          className="car-hero"
          style={{
            backgroundImage: `url(${car.photos?.[0]?.photo_url || ""})`,
          }}
        >
          <div className="overlay">
            <h1>Car Details</h1>
          </div>
        </div>

        {/* Car Info */}
        <div className="car-info">
          <h2>
            {car.make} {car.model}
          </h2>
        </div>

        {/* Carousel */}
        {car.photos?.length > 0 && (
          <div className="carousel">
            <button className="prev" onClick={prevImage}>
              &#10094;
            </button>
            <img
              src={car.photos[currentImageIndex].photo_url}
              alt={`Car ${currentImageIndex + 1}`}
              className="carousel-image"
            />
            <button className="next" onClick={nextImage}>
              &#10095;
            </button>
          </div>
        )}

        {/* Tabs */}
        <CarTabs car={car} />

        {/* Charges */}
        <ChargesCard
          carCharges={carCharges}
          insuranceCharges={insuranceCharges}
          driverCharges={driverCharges}
          pickDropCharges={pickDropCharges}
          gst={gst}
          onPay={() => alert("Proceeding to payment...")}
        />
      </div>
      <Footer />
    </>
  );
};

export default CarDetails;
