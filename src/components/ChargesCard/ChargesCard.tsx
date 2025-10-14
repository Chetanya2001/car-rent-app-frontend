import React, { useState } from "react";
import "./ChargesCard.css";

interface ChargesCardProps {
  carCharges: number;
  insuranceCharges: number;
  driverCharges: number;
  pickDropCharges: number;
  gst: number;
  carLocation?: string;
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
  const [isAgreed, setIsAgreed] = useState(false);

  // 🔎 Debug log
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

        {/* Checkbox before agreement text */}
        {/* Checkbox & Agreement Section */}
        <div
          className="terms-agree"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0",
          }}
        >
          <input
            type="checkbox"
            id="termsAgree"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            style={{
              accentColor: "#22c55e", // optional: matches a green theme
              width: 20,
              height: 20,
              verticalAlign: "middle",
              cursor: "pointer",
            }}
          />
          <label
            htmlFor="termsAgree"
            style={{
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            You agree to{" "}
            <a
              href="https://www.zipdrive.in/tnc-guest.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#22c55e",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              terms & conditions
            </a>
            {", including the cancellation policy."}
          </label>
        </div>

        <button
          className="pay-btn"
          onClick={onPay}
          disabled={!isAgreed}
          style={{
            opacity: isAgreed ? 1 : 0.6,
            cursor: isAgreed ? "pointer" : "not-allowed",
            transition: "opacity 0.2s",
          }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default ChargesCard;
