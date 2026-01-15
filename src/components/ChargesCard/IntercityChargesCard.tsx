import React, { useState, useMemo } from "react";
import "./ChargesCard.css";

interface IntercityChargesCardProps {
  pickupStation: string;
  pickupCity: string;
  dropAddress: string;
  dropCity: string;
  tripKm: number;
  pricePerKm: number;
  insureTrip: boolean;
  insurancePerKm?: number;
  onPay: () => void;
}

const GST_RATE = 0.18;

const IntercityChargesCard: React.FC<IntercityChargesCardProps> = ({
  pickupStation,
  pickupCity,
  dropAddress,
  dropCity,
  tripKm,
  pricePerKm,
  insureTrip,
  insurancePerKm = 1.5,
  onPay,
}) => {
  const [isAgreed, setIsAgreed] = useState(false);

  const pricing = useMemo(() => {
    const baseFare = Math.round(tripKm * pricePerKm);
    const insurance = insureTrip ? Math.round(tripKm * insurancePerKm) : 0;

    const subTotal = baseFare + insurance;
    const gst = Math.round(subTotal * GST_RATE);

    return {
      baseFare,
      insurance,
      gst,
      total: subTotal + gst, // GST INCLUDED
    };
  }, [tripKm, pricePerKm, insureTrip, insurancePerKm]);

  return (
    <div className="booking-container">
      {/* CHECK DETAILS */}
      <div className="check-details">
        <h3>Trip Details</h3>

        <div className="detail-item">
          <span className="icon">📍</span>
          <span>
            <strong>Pickup Station:</strong> {pickupStation}, {pickupCity}
          </span>
        </div>

        <div className="detail-item">
          <span className="icon">🏁</span>
          <span>
            <strong>Drop Location:</strong> {dropAddress}, {dropCity}
          </span>
        </div>

        <div className="detail-item">
          <span className="icon">🛣️</span>
          <span>
            <strong>Trip Distance:</strong> {tripKm} km
          </span>
        </div>

        <div className="detail-item">
          <span className="icon">🤝</span>
          <span>Driver included • GST applicable</span>
        </div>
      </div>

      {/* CHARGES */}
      <div className="charges-card">
        <h3>Fare Breakdown</h3>

        <div className="charge-item">
          <span>Base Fare ({pricePerKm}/km)</span>
          <span>₹ {pricing.baseFare}</span>
        </div>

        <div className="charge-item">
          <span>Insurance</span>
          <span>₹ {pricing.insurance}</span>
        </div>

        <div className="charge-item">
          <span>GST (18%)</span>
          <span>₹ {pricing.gst}</span>
        </div>

        <div className="charge-total">
          <span>Total Payable</span>
          <span>₹ {pricing.total}</span>
        </div>

        <div
          style={{
            marginTop: 15,
            background: "#ebfaeb",
            color: "#277919",
            padding: 10,
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          GST included in total • Pay at pickup
        </div>

        {/* AGREEMENT */}
        <div className="terms-agree">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
          <label>
            I agree to{" "}
            <a
              href="https://www.zipdrive.in/tnc-guest.html"
              target="_blank"
              rel="noreferrer"
            >
              terms & conditions
            </a>
          </label>
        </div>

        <button
          className="pay-btn"
          disabled={!isAgreed}
          onClick={onPay}
          style={{
            opacity: isAgreed ? 1 : 0.6,
            cursor: isAgreed ? "pointer" : "not-allowed",
          }}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default IntercityChargesCard;
