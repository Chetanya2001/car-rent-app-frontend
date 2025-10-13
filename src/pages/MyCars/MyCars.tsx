import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHostCars } from "../../services/carService";
import type { Car } from "../../types/Cars";
import Navbar from "../../components/Navbar/Navbar";
import "./MyCars.css";

export default function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getHostCars();

        if (!Array.isArray(data.cars)) {
          console.error("Invalid response from backend:", data);
          setCars([]);
        } else {
          const processedCars = data.cars.map((car: any) => ({
            ...car,
            photos: Array.isArray(car.photos) ? car.photos : [],
          }));
          setCars(processedCars);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  const handleUpdate = (carId: number) => {
    navigate(`/update-car/${carId}`);
  };

  const handleDetails = (carId: number) => {
    navigate(`/car-details/${carId}`);
  };

  return (
    <>
      <Navbar />
      <div className="my-cars-page">
        <div className="page-header">
          <h2>My Listed Cars</h2>
          <p className="subtitle">Manage and view all your listed vehicles</p>
        </div>

        <div className="cars-grid">
          {cars.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <p>No cars found.</p>
              <p className="empty-subtitle">
                Start by adding your first vehicle
              </p>
            </div>
          ) : (
            cars.map((car) => {
              const mainImage =
                car.photos && car.photos.length > 0 ? car.photos[0] : "";

              return (
                <div key={car.id} className="car-card">
                  <div className="car-image-container">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={`${car.make} ${car.model}`}
                        className="car-img"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const placeholder = (e.target as HTMLElement)
                            .nextElementSibling;
                          if (placeholder)
                            placeholder.setAttribute("style", "display: flex;");
                        }}
                      />
                    ) : null}
                    <div
                      className="car-img placeholder"
                      style={{ display: "none" }}
                    >
                      <span>📷</span>
                      <span>No Image</span>
                    </div>
                  </div>

                  <div className="car-info">
                    <h3 className="car-title">
                      {car.make} {car.model}
                    </h3>

                    <div className="car-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Year</span>
                        <span className="detail-value">{car.year}</span>
                      </div>

                      <div className="detail-item price-item">
                        <span className="detail-label">Price</span>
                        <span className="detail-value price">
                          {car.price_per_hour
                            ? `₹${car.price_per_hour}/hr`
                            : "Not set"}
                        </span>
                      </div>
                    </div>

                    {car.available_from && car.available_till && (
                      <div className="availability-box">
                        <span className="availability-label">Available</span>
                        <span className="availability-dates">
                          {new Date(car.available_from).toLocaleDateString()} -{" "}
                          {new Date(car.available_till).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {car.documents && (
                      <div className="document-info">
                        <div className="doc-item">
                          <span className="doc-label">RC Number:</span>
                          <span className="doc-value">
                            {car.documents.rc_number}
                          </span>
                        </div>
                        <div className="doc-item">
                          <span className="doc-label">Owner:</span>
                          <span className="doc-value">
                            {car.documents.owner_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="car-actions">
                    <button
                      className="action-btn details-btn"
                      onClick={() => handleDetails(car.id)}
                    >
                      View Details
                    </button>
                    <button
                      className="action-btn update-btn"
                      onClick={() => handleUpdate(car.id)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
