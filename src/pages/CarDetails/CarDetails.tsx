import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CarDetails.css";
import type { CarDetails } from "../../types/CarDetails";
import { getCarDetails } from "../../services/carDetails";
import CarTabs from "../../components/CarTabs/CarsTab";

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      {/* Car Info Section */}
      <div className="car-info">
        <h2>
          {car.make} {car.model}
        </h2>

        <div className="car-features">
          <div className="feature">
            <i className="fas fa-tachometer-alt"></i>
            <p>
              Mileage
              <br />
              {/* <span>{car.kms_driven?.toLocaleString() || "N/A"} km</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-cogs"></i>
            <p>
              Transmission
              <br />
              {/* <span>{car.transmission || "N/A"}</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <p>
              Seats
              <br />
              {/* <span>{car.seats || "N/A"} Adults</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-suitcase"></i>
            <p>
              Luggage
              <br />
              {/* <span>{car.luggage || "N/A"} Bags</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-gas-pump"></i>
            <p>
              Fuel
              <br />
              {/* <span>{car.fuel || "N/A"}</span> */}
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
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
      <div>
        <CarTabs car={car} />
      </div>
    </div>
  );
};

export default CarDetails;
