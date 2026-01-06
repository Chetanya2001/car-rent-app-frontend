import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHostCars, deleteCarById } from "../../services/carService";
import { updateCarDetails } from "../../services/carDetails";
import type { Car } from "../../types/Cars";
import Navbar from "../../components/Navbar/Navbar";
import "./MyCars.css";

const FEATURES = [
  { key: "airconditions", label: "Air Conditioning", icon: "❄️" },
  { key: "child_seat", label: "Child Seat", icon: "👶" },
  { key: "gps", label: "GPS Navigation", icon: "📍" },
  { key: "luggage", label: "Luggage Space", icon: "🧳" },
  { key: "music", label: "Music System", icon: "🎵" },
  { key: "seat_belt", label: "Seat Belt", icon: "🔒" },
  { key: "sleeping_bed", label: "Sleeping Bed", icon: "🛏️" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "bluetooth", label: "Bluetooth", icon: "📱" },
  { key: "onboard_computer", label: "Onboard Computer", icon: "💻" },
  { key: "audio_input", label: "Audio Input", icon: "🎧" },
  { key: "long_term_trips", label: "Long Term Trips", icon: "🚗" },
  { key: "car_kit", label: "Car Kit", icon: "🧰" },
  {
    key: "remote_central_locking",
    label: "Remote Central Locking",
    icon: "🔑",
  },
  { key: "climate_control", label: "Climate Control", icon: "🌡️" },
];

export default function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Edit form states
  const [editingFeatures, setEditingFeatures] = useState<
    Record<string, boolean>
  >({});
  const [editingPrice, setEditingPrice] = useState("");
  const [editingInsuranceCompany, setEditingInsuranceCompany] = useState("");
  const [editingIdvValue, setEditingIdvValue] = useState("");
  const [editingValidTill, setEditingValidTill] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      const data = await getHostCars();

      if (Array.isArray(data.cars)) {
        const processedCars = data.cars.map((car: any) => ({
          ...car,
          photos: Array.isArray(car.photos) ? car.photos : [],
          price_per_hour:
            typeof car.price_per_hour === "string"
              ? car.price_per_hour.replace(/\$/g, "")
              : car.price_per_hour,
        }));

        setCars(processedCars);
      } else {
        setCars([]);
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleUpdate = (car: Car) => {
    setCarToEdit(car);

    // Initialize features
    const initialFeatures: Record<string, boolean> = {};
    FEATURES.forEach((feature) => {
      initialFeatures[feature.key] = !!(car as any).features?.[feature.key];
    });
    setEditingFeatures(initialFeatures);

    // Initialize other fields
    setEditingPrice(car.price_per_hour?.toString() || "");
    setEditingInsuranceCompany((car as any).insurance?.company || "");
    setEditingIdvValue((car as any).insurance?.idv_value?.toString() || "");
    setEditingValidTill((car as any).insurance?.valid_till || "");
    setSelectedImage(null);
    setImagePreview(null);

    setShowEditModal(true);
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
      const response = await deleteCarById(carToDelete);

      if (response.status === "deleted") {
        alert(`Car ${getCarName(carToDelete)} deleted successfully!`);
        await fetchCars();
      } else if (response.status === "hidden") {
        alert(
          `Car ${getCarName(carToDelete)} has past bookings and is now hidden.`
        );
        await fetchCars();
      } else if (response.status === "active_booking") {
        alert(
          `Cannot delete ${getCarName(
            carToDelete
          )} because it has active or future bookings.`
        );
      } else {
        alert(`Unexpected response: ${JSON.stringify(response)}`);
      }

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

  const handleEditCancel = () => {
    setShowEditModal(false);
    setCarToEdit(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async () => {
    if (!carToEdit) return;

    setIsSaving(true);
    try {
      const updatePayload: any = {
        car_id: carToEdit.id,
      };

      // Add features
      const cleanFeatures: Record<string, boolean> = {};
      FEATURES.forEach((feature) => {
        cleanFeatures[feature.key] = !!editingFeatures[feature.key];
      });
      updatePayload.features = cleanFeatures;

      // Add pricing
      if (editingPrice) {
        updatePayload.price_per_hour = parseFloat(editingPrice);
      }

      // Add insurance details
      if (editingInsuranceCompany) {
        updatePayload.insurance_company = editingInsuranceCompany;
      }
      if (editingIdvValue) {
        updatePayload.insurance_idv_value = parseFloat(editingIdvValue);
      }
      if (editingValidTill) {
        updatePayload.insurance_valid_till = editingValidTill;
      }
      if (selectedImage) {
        updatePayload.insurance_image = selectedImage;
      }

      await updateCarDetails(updatePayload);

      alert("Car details updated successfully!");
      setShowEditModal(false);
      setCarToEdit(null);
      await fetchCars();
    } catch (err: any) {
      console.error("Error updating car:", err);
      alert(err.response?.data?.message || "Failed to update car details");
    } finally {
      setIsSaving(false);
    }
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
                      onClick={() => handleUpdate(car)}
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

      {/* Edit Modal */}
      {showEditModal && carToEdit && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div
            className="edit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>
                Edit Car Details - {carToEdit.make} {carToEdit.model}
              </h3>
              <button
                className="modal-close"
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                ×
              </button>
            </div>

            <div className="modal-body edit-modal-body">
              {/* Features Section */}
              <div className="edit-section">
                <h4 className="section-title">Features</h4>
                <div className="features-grid-edit">
                  {FEATURES.map((feature) => (
                    <label key={feature.key} className="feature-checkbox">
                      <input
                        type="checkbox"
                        checked={!!editingFeatures[feature.key]}
                        onChange={(e) =>
                          setEditingFeatures((prev) => ({
                            ...prev,
                            [feature.key]: e.target.checked,
                          }))
                        }
                      />
                      <span className="feature-label">
                        {feature.icon} {feature.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="edit-section">
                <h4 className="section-title">Pricing</h4>
                <div className="input-group">
                  <label>Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={editingPrice}
                    onChange={(e) => setEditingPrice(e.target.value)}
                    placeholder="Enter hourly rate"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Insurance Section */}
              <div className="edit-section">
                <h4 className="section-title">Insurance Details</h4>

                <div className="input-group">
                  <label>Insurance Company</label>
                  <input
                    type="text"
                    value={editingInsuranceCompany}
                    onChange={(e) => setEditingInsuranceCompany(e.target.value)}
                    placeholder="Enter insurance company"
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label>IDV Value (₹)</label>
                  <input
                    type="number"
                    value={editingIdvValue}
                    onChange={(e) => setEditingIdvValue(e.target.value)}
                    placeholder="Enter IDV value"
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label>Valid Till</label>
                  <input
                    type="date"
                    value={editingValidTill}
                    onChange={(e) => setEditingValidTill(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <label>Insurance Document</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-input file-input"
                  />
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img
                        src={imagePreview}
                        alt="Insurance preview"
                        className="image-preview"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn cancel-btn"
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="modal-btn save-btn"
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
