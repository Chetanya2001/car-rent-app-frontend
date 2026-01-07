// src/components/common/LocationPickerModal/MapPickerModal.tsx
import React from "react";
import LocationPicker from "../../Map/LocationPicker";
import "./LocationPickerModal.css";
import { formatShortAddress } from "./utils";

interface MapPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: any) => void;
  initialPosition: [number, number];
  title?: string;
}

export const MapPickerModal: React.FC<MapPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialPosition,
  title = "Select Location on Map",
}) => {
  const [selectedLocation, setSelectedLocation] = React.useState<any>(null);

  // This now matches the new LocationPicker's onSelect signature
  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onConfirm(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div
        className="location-modal map-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="availability-modal-header">
          <h3 className="availability-modal-title">{title}</h3>
          <button onClick={onClose} className="availability-close-button">
            ✕
          </button>
        </div>

        {/* ✅ Correct props for the updated LocationPicker */}
        <LocationPicker
          initialPosition={initialPosition}
          onSelect={handleLocationSelect}
        />

        {/* Optional: Show live selected address */}
        {selectedLocation && (
          <div
            style={{
              padding: "0 24px 16px",
              fontSize: "15px",
              color: "#059669",
              background: "#f0fdf7",
              borderRadius: "8px",
              margin: "0 24px 16px",
              border: "1px solid #d1fae5",
            }}
          >
            📍 <strong>Selected:</strong>{" "}
            {formatShortAddress(selectedLocation.address)}
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="availability-modal-confirm-button"
          disabled={!selectedLocation}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};
