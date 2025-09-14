import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CarDetails.css";
import type { Car } from "../../types/Cars";

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // car_id from route
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (id) {
          //   const data = await getCarById(Number(id)); // backend call
          //   setCar(data);
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return <p>Loading car details...</p>;
  }

  if (!car) {
    return <p>No car found.</p>;
  }

  return (
    <div className="car-details-page">
      {/* Hero Section */}
      <div
        className="car-hero"
        style={{
          backgroundImage: `url(${car.photos?.[0] || ""})`,
        }}
      >
        <div className="overlay">
          <div className="breadcrumb">HOME &gt; CAR DETAILS</div>
          <h1>Car Details</h1>
        </div>
      </div>

      {/* Car Info Section */}
      <div className="car-info">
        {/* <p className="car-type">{car.type}</p> */}
        <h2>
          {car.make} {car.model}
        </h2>

        <div className="car-features">
          <div className="feature">
            <i className="fas fa-tachometer-alt"></i>
            <p>
              Mileage
              <br />
              <span>{car.kms_driven?.toLocaleString()} km</span>
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-cogs"></i>
            <p>
              Transmission
              <br />
              {/* <span>{car.transmission}</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <p>
              Seats
              <br />
              {/* <span>{car.seats} Adults</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-suitcase"></i>
            <p>
              Luggage
              <br />
              {/* <span>{car.luggage} Bags</span> */}
            </p>
          </div>
          <div className="feature">
            <i className="fas fa-gas-pump"></i>
            <p>
              Fuel
              <br />
              {/* <span>{car.fuel}</span> */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
