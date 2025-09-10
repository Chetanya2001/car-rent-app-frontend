import { useState } from "react";
import { addCarFeatures } from "../../services/carFeatures"; // ✅ Import API call
import type { CarFormData } from "../../types/Cars";
import "./Step4Features.css";

interface Props {
  onNext: (data: Partial<CarFormData>) => void;
  onBack: () => void;
  defaultValues: CarFormData;
  carId: number; // ✅ carId passed from wizard
}

export default function Step4Features({
  onNext,
  onBack,
  defaultValues,
  carId,
}: Props) {
  const [fastTag, setFastTag] = useState(defaultValues.fastTag ?? false);
  const [airconditions, setAirconditions] = useState(
    defaultValues.airconditions ?? false
  );
  const [seater, setSeater] = useState(defaultValues.seater ?? 4);
  const [fuelType, setFuelType] = useState(defaultValues.fuelType ?? "");
  const [gps, setGps] = useState(defaultValues.gps ?? false);
  const [geofencing, setGeofencing] = useState(
    defaultValues.geofencing ?? false
  );
  const [antiTheft, setAntiTheft] = useState(defaultValues.antiTheft ?? false);
  const [childSeat, setChildSeat] = useState(defaultValues.child_seat ?? false);
  const [luggage, setLuggage] = useState(defaultValues.luggage ?? false);
  const [music, setMusic] = useState(defaultValues.music ?? false);
  const [seatBelt, setSeatBelt] = useState(defaultValues.seat_belt ?? false);
  const [sleepingBed, setSleepingBed] = useState(
    defaultValues.sleeping_bed ?? false
  );
  const [water, setWater] = useState(defaultValues.water ?? false);
  const [bluetooth, setBluetooth] = useState(defaultValues.bluetooth ?? false);
  const [onboardComputer, setOnboardComputer] = useState(
    defaultValues.onboard_computer ?? false
  );
  const [audioInput, setAudioInput] = useState(
    defaultValues.audio_input ?? false
  );
  const [longTermTrips, setLongTermTrips] = useState(
    defaultValues.long_term_trips ?? false
  );
  const [carKit, setCarKit] = useState(defaultValues.car_kit ?? false);
  const [remoteCentralLocking, setRemoteCentralLocking] = useState(
    defaultValues.remote_central_locking ?? false
  );
  const [climateControl, setClimateControl] = useState(
    defaultValues.climate_control ?? false
  );

  const features = [
    { label: "Fast Tag Enabled", checked: fastTag, onChange: setFastTag },
    {
      label: "Air Conditioning",
      checked: airconditions,
      onChange: setAirconditions,
    },
    { label: "Child Seat", checked: childSeat, onChange: setChildSeat },
    { label: "GPS Enabled", checked: gps, onChange: setGps },
    { label: "Luggage Space", checked: luggage, onChange: setLuggage },
    { label: "Music System", checked: music, onChange: setMusic },
    { label: "Seat Belt", checked: seatBelt, onChange: setSeatBelt },
    { label: "Sleeping Bed", checked: sleepingBed, onChange: setSleepingBed },
    { label: "Water Available", checked: water, onChange: setWater },
    { label: "Bluetooth", checked: bluetooth, onChange: setBluetooth },
    {
      label: "Onboard Computer",
      checked: onboardComputer,
      onChange: setOnboardComputer,
    },
    { label: "Audio Input", checked: audioInput, onChange: setAudioInput },
    {
      label: "Long Term Trips",
      checked: longTermTrips,
      onChange: setLongTermTrips,
    },
    { label: "Car Kit", checked: carKit, onChange: setCarKit },
    {
      label: "Remote Central Locking",
      checked: remoteCentralLocking,
      onChange: setRemoteCentralLocking,
    },
    {
      label: "Climate Control",
      checked: climateControl,
      onChange: setClimateControl,
    },
    { label: "Geofencing", checked: geofencing, onChange: setGeofencing },
    {
      label: "Anti-theft Protection",
      checked: antiTheft,
      onChange: setAntiTheft,
    },
  ];

  // Split features into two columns
  const midPoint = Math.ceil(features.length / 2);
  const leftColumn = features.slice(0, midPoint);
  const rightColumn = features.slice(midPoint);

  const handleNext = async () => {
    try {
      // Data for the backend CarFeatures model
      const carFeaturesData = {
        car_id: carId,
        airconditions,
        child_seat: childSeat,
        gps,
        luggage,
        music,
        seat_belt: seatBelt,
        sleeping_bed: sleepingBed,
        water,
        bluetooth,
        onboard_computer: onboardComputer,
        audio_input: audioInput,
        long_term_trips: longTermTrips,
        car_kit: carKit,
        remote_central_locking: remoteCentralLocking,
        climate_control: climateControl,
      };

      // Call backend API to save CarFeatures
      await addCarFeatures(carFeaturesData);

      // Data for the wizard (includes all fields)
      const featureData = {
        car_id: carId,
        fastTag,
        airconditions,
        seater,
        fuelType,
        gps,
        geofencing,
        antiTheft,
        child_seat: childSeat,
        luggage,
        music,
        seat_belt: seatBelt,
        sleeping_bed: sleepingBed,
        water,
        bluetooth,
        onboard_computer: onboardComputer,
        audio_input: audioInput,
        long_term_trips: longTermTrips,
        car_kit: carKit,
        remote_central_locking: remoteCentralLocking,
        climate_control: climateControl,
      };

      // Pass all data to the next step in the wizard
      onNext(featureData);
    } catch (error) {
      console.error("❌ Error saving features:", error);
      alert("Failed to save car features. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <label className="block mb-2 font-semibold">Seater</label>
      <input
        type="number"
        value={seater}
        onChange={(e) => setSeater(Number(e.target.value))}
        className="w-full border p-2 rounded mb-4"
        min="1"
      />

      <label className="block mb-2 font-semibold">Fuel Type</label>
      <select
        value={fuelType}
        onChange={(e) => setFuelType(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="">Select Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="EV">EV</option>
      </select>

      <div className="features-grid">
        <div className="features-column">
          {leftColumn.map(({ label, checked, onChange }) => (
            <label key={label} className="toggle-label">
              <span className="label-text">{label}</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
              />
              <span className="toggle-switch"></span>
            </label>
          ))}
        </div>
        <div className="features-divider"></div>
        <div className="features-column">
          {rightColumn.map(({ label, checked, onChange }) => (
            <label key={label} className="toggle-label">
              <span className="label-text">{label}</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
              />
              <span className="toggle-switch"></span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ← Back
        </button>
        &nbsp;&nbsp;&nbsp;
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Next Step →
        </button>
      </div>
    </div>
  );
}
