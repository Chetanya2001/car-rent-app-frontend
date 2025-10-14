import React from "react";
import "./ChargesCard.css";

interface ChargesCardProps {
  carCharges: number;
  insuranceCharges: number;
  driverCharges: number;
  pickDropCharges: number;
  gst: number;
  carLocation?: string; // ✅ Only location
  onPay: () => void;
}

const ChargesCard: React.FC<ChargesCardProps> = ({
  carCharges,
  insuranceCharges,
  driverCharges,
  pickDropCharges,
  gst,
  carLocation,
  onPay,
}) => {
  const totalCost =
    carCharges + insuranceCharges + driverCharges + pickDropCharges + gst;

  // ✅ Debugging log
  console.log("👉 ChargesCard props:", {
    carCharges,
    insuranceCharges,
    driverCharges,
    pickDropCharges,
    gst,
    carLocation,
    totalCost,
  });

  return (
    <div className="booking-container">
      <div className="check-details">
        <h3>Check Details</h3>

        <div className="detail-item">
          <span className="icon">📍</span>
          <span>
            <strong>Car Pickup Location:</strong>{" "}
            {carLocation || "Not specified"}
          </span>
        </div>

        <div className="detail-item">
          <span className="icon">🤝</span>
          <span>You have a valid license and documents to drive.</span>
        </div>

        <div className="detail-item">
          <span className="icon">🚗</span>
          <span>
            You agree to key terms and conditions including the cancellation
            policy.
          </span>
        </div>
      </div>

      <div className="charges-card">
        <h3>Confirm Your Booking</h3>

        <div className="charge-item">
          <span>CAR CHARGES:</span> <span>INR {carCharges}</span>
        </div>
        <div className="charge-item">
          <span>INSURE CHARGES:</span> <span>INR {insuranceCharges}</span>
        </div>
        <div className="charge-item">
          <span>DRIVER CHARGES:</span> <span>INR {driverCharges}</span>
        </div>
        <div className="charge-item">
          <span>PICK & DROP CHARGES:</span> <span>INR {pickDropCharges}</span>
        </div>
        <div className="charge-item">
          <span>GST (18%):</span> <span>INR {gst}</span>
        </div>

        <div className="charge-total">
          <span>TOTAL COST:</span> <span>INR {totalCost}</span>
        </div>

        <button className="pay-btn" onClick={onPay}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default ChargesCard;
