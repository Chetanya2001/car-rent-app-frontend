import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHostCars, deleteCarById } from "../../services/carService";
import { updateCarDetails } from "../../services/carDetails";
import { updateCarFeatures } from "../../services/carFeatures";
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
  const [selectedImage, setSelectedImage] = useState<any>(null);
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
      setSelectedImage(file); // file is File | undefined
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
      const carId = carToEdit.id;

      // ✅ 1. Update FEATURES first (separate API call)
      const cleanFeatures: Record<string, boolean> = {};
      FEATURES.forEach((feature) => {
        cleanFeatures[feature.key] = !!editingFeatures[feature.key];
      });
      await updateCarFeatures(carId, cleanFeatures); // 🆕 Uses your new service

      // ✅ 2. Update PRICE + INSURANCE (existing API)
      const updatePayload: any = {
        car_id: carId,
      };

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

      alert("✅ Car updated successfully!");
      setShowEditModal(false);
      setCarToEdit(null);
      await fetchCars(); // Refresh list
    } catch (err: any) {
      console.error("❌ Update error:", err);
      alert(err.response?.data?.message || "Failed to update car");
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
                          ₹{car.price_per_hour}/hr
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

      {/* Premium Edit Modal */}
      {showEditModal && carToEdit && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div
            className="premium-edit-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="premium-modal-header">
              <div className="modal-header-content">
                <div>
                  <h3 className="modal-title">Edit Car Details</h3>
                  <p className="modal-subtitle">
                    {carToEdit.make} {carToEdit.model} • {carToEdit.year}
                  </p>
                </div>
              </div>
              <button
                className="premium-close-btn"
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                ×
              </button>
            </div>

            <div className="premium-modal-body">
              {/* Features Section with Toggle Switches */}
              <div className="premium-section">
                <div className="section-header">
                  <span className="section-icon">🎯</span>
                  <h4 className="section-title">Features</h4>
                </div>
                <div className="features-toggle-grid">
                  {FEATURES.map((feature) => (
                    <div key={feature.key} className="toggle-item">
                      <div className="toggle-label-wrapper">
                        <span className="toggle-icon">{feature.icon}</span>
                        <span className="toggle-label">{feature.label}</span>
                      </div>
                      <label className="toggle-switch">
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
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="premium-section">
                <div className="section-header">
                  <span className="section-icon">💰</span>
                  <h4 className="section-title">Pricing</h4>
                </div>
                <div className="premium-input-wrapper">
                  <label className="premium-label">Hourly Rate</label>
                  <div className="input-with-icon">
                    <span className="input-icon">₹</span>
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={(e) => setEditingPrice(e.target.value)}
                      placeholder="Enter hourly rate"
                      className="premium-input"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Insurance Section */}
              <div className="premium-section">
                <div className="section-header">
                  <span className="section-icon">🛡️</span>
                  <h4 className="section-title">Insurance Details</h4>
                </div>

                <div className="insurance-grid">
                  <div className="premium-input-wrapper">
                    <label className="premium-label">Insurance Company</label>
                    <input
                      type="text"
                      value={editingInsuranceCompany}
                      onChange={(e) =>
                        setEditingInsuranceCompany(e.target.value)
                      }
                      placeholder="e.g., ICICI Lombard"
                      className="premium-input"
                    />
                  </div>

                  <div className="premium-input-wrapper">
                    <label className="premium-label">IDV Value</label>
                    <div className="input-with-icon">
                      <span className="input-icon">₹</span>
                      <input
                        type="number"
                        value={editingIdvValue}
                        onChange={(e) => setEditingIdvValue(e.target.value)}
                        placeholder="Insured Declared Value"
                        className="premium-input"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="premium-input-wrapper">
                    <label className="premium-label">Valid Till</label>
                    <input
                      type="date"
                      value={editingValidTill}
                      onChange={(e) => setEditingValidTill(e.target.value)}
                      className="premium-input"
                    />
                  </div>

                  <div className="premium-input-wrapper full-width">
                    <label className="premium-label">Insurance Document</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input-hidden"
                        id="insurance-upload"
                      />
                      <label
                        htmlFor="insurance-upload"
                        className="file-upload-label"
                      >
                        <span className="upload-icon">📎</span>
                        <span className="upload-text">
                          {selectedImage
                            ? selectedImage.name
                            : "Click to upload insurance document"}
                        </span>
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="premium-image-preview">
                        <img src={imagePreview} alt="Insurance preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-modal-footer">
              <button
                className="premium-btn cancel"
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="premium-btn save"
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
