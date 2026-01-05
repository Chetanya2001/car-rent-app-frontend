import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHostCars, deleteCarById } from "../../services/carService";
import type { Car } from "../../types/Cars";
import Navbar from "../../components/Navbar/Navbar";
import "./MyCars.css";

export default function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getHostCars();
        console.log("Fetched car data:", data);

        if (!Array.isArray(data.cars)) {
          console.error("Invalid response from backend:", data);
          setCars([]);
        } else {
          const processedCars = data.cars.map((car: any) => ({
            ...car,
            photos: Array.isArray(car.photos) ? car.photos : [],
            price_per_hour:
              typeof car.price_per_hour === "string"
                ? car.price_per_hour.replace(/\$/g, "")
                : car.price_per_hour,
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

  const handleDeleteClick = (carId: number) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (carToDelete === null) return;

    setIsDeleting(true);
    try {
      // Call API
      const response = await deleteCarById(carToDelete);

      // Backend will respond with status:
      // { status: "deleted" } => deleted successfully
      // { status: "hidden" } => set to invisible due to past bookings
      // { status: "active_booking" } => cannot delete due to active/future bookings

      if (response.status === "deleted") {
        setCars(cars.filter((car) => car.id !== carToDelete));
        alert(`Car ${getCarName(carToDelete)} deleted successfully!`);
      } else if (response.status === "hidden") {
        // Optionally update local state if needed
        setCars(
          cars.map((car) =>
            car.id === carToDelete ? { ...car, is_visible: false } : car
          )
        );
        alert(
          `Car ${getCarName(carToDelete)} has past bookings and is now hidden.`
        );
      } else if (response.status === "active_booking") {
        alert(
          `Cannot delete ${getCarName(
            carToDelete
          )} because it has active or future bookings.`
        );
      } else {
        alert(`Unexpected response: ${JSON.stringify(response)}`);
      }

      // Close modal and reset
      setShowDeleteModal(false);
      setCarToDelete(null);
    } catch (err: any) {
      console.error("❌ Error deleting car:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete car";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCarToDelete(null);
  };

  const getCarName = (carId: number) => {
    const car = cars.find((c) => c.id === carId);
    return car ? `${car.make} ${car.model}` : "this car";
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
                            ? `₹${String(car.price_per_hour).replace(
                                /\$/g,
                                ""
                              )} / hr`
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
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(car.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                className="modal-close"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <p>
                Are you sure you want to delete{" "}
                <strong>{getCarName(carToDelete!)}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm-btn"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
