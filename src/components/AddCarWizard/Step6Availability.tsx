import React, { useState } from "react";
import type { CarFormData } from "../../types/Cars";
import { uploadAvailability } from "../../services/carService"; // ✅ use service

export interface AvailabilityProps {
  onNext: (data: Partial<CarFormData>) => void;
  onBack: () => void;
  defaultValues: CarFormData;
  carId: number; // ✅ passed from parent wizard
}

const AvailabilityStep: React.FC<AvailabilityProps> = ({
  onNext,
  onBack,
  defaultValues,
  carId,
}) => {
  const [expectedHourlyRent, setExpectedHourlyRent] = useState<number>(
    defaultValues?.expectedHourlyRent || 0
  );
  const [availabilityFrom, setAvailabilityFrom] = useState<string>(
    defaultValues?.availabilityFrom || ""
  );
  const [availabilityTill, setAvailabilityTill] = useState<string>(
    defaultValues?.availabilityTill || ""
  );
  const [submitting, setSubmitting] = useState(false);
  const handleNext = async () => {
    if (!expectedHourlyRent || !availabilityFrom || !availabilityTill) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await uploadAvailability({
        car_id: carId,
        price_per_hour: expectedHourlyRent,
        available_from: availabilityFrom,
        available_till: availabilityTill,
      });

      console.log("✅ Availability API result:", result);

      const savedCar = result.data; // 👈 because service already returns .data

      // Pass the updated car back into the wizard
      onNext({
        expectedHourlyRent,
        availabilityFrom,
        availabilityTill,
        ...savedCar,
      });
    } catch (err: any) {
      console.error(
        "❌ Error saving availability:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Error saving availability");
    } finally {
      setSubmitting(false);
    }
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
      <br />

      <div className="form-actions">
        <button className="back-btn" onClick={onBack} disabled={submitting}>
          ⬅ Back
        </button>
        &nbsp;&nbsp;&nbsp;
        <button className="next-btn" onClick={handleNext} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit ✅"}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityStep;
