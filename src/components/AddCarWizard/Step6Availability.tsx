import React, { useState } from "react";

import type { CarFormData } from "../../types/Cars";

export interface AvailabilityProps {
  onNext: (data: AvailabilityData) => void;
  onBack: () => void;
  defaultValues: CarFormData;
}

export interface AvailabilityData {
  expectedHourlyRent: number;
  availabilityFrom: string;
  availabilityTill: string;
}

const AvailabilityStep: React.FC<AvailabilityProps> = ({ onNext, onBack }) => {
  const [expectedHourlyRent, setExpectedHourlyRent] = useState<number>(0);
  const [availabilityFrom, setAvailabilityFrom] = useState<string>("");
  const [availabilityTill, setAvailabilityTill] = useState<string>("");

  const handleNext = () => {
    if (!expectedHourlyRent || !availabilityFrom || !availabilityTill) {
      alert("Please fill all fields before proceeding.");
      return;
    }
    onNext({ expectedHourlyRent, availabilityFrom, availabilityTill });
  };

  return (
    <div className="form-step">
      <h2>Availability & Rent</h2>
      <p>Set your car’s availability and expected hourly rent</p>

      <div className="form-group">
        <label>Expected Hourly Rent (₹)</label>
        <input
          type="number"
          placeholder="Enter amount in INR"
          value={expectedHourlyRent || ""}
          onChange={(e) => setExpectedHourlyRent(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Availability From</label>
        <input
          type="date"
          value={availabilityFrom}
          onChange={(e) => setAvailabilityFrom(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Availability Till</label>
        <input
          type="date"
          value={availabilityTill}
          onChange={(e) => setAvailabilityTill(e.target.value)}
        />
      </div>
      <br></br>

      <div className="form-actions">
        <button className="back-btn" onClick={onBack}>
          ⬅ Back
        </button>
        &nbsp;&nbsp;&nbsp;
        <button className="next-btn" onClick={handleNext}>
          Submit ✅
        </button>
      </div>
    </div>
  );
};

export default AvailabilityStep;
