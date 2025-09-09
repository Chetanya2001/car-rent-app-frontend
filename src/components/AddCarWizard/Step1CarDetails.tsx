import { useState } from "react";
import type { CarFormData } from "../../types/Cars";
import { addCar } from "../../services/carService";

interface Props {
  onNext: (data: Partial<CarFormData>, carId: string) => void;
  defaultValues: CarFormData;
}

// Hardcoded data for India-specific car makes and models
const carData: { [key: string]: string[] } = {
  "Maruti Suzuki": [
    "Alto K10",
    "Wagon R",
    "Swift",
    "Dzire",
    "Ertiga",
    "Celerio",
    "Brezza",
    "Baleno",
    "Ignis",
    "XL6",
    "S-Presso",
    "Grand Vitara",
    "Jimny",
    "Fronx",
    "Invicto",
  ],
  Hyundai: [
    "Creta",
    "i20",
    "Verna",
    "Venue",
    "Alcazar",
    "Tucson",
    "Grand i10 Nios",
    "Aura",
    "Kona Electric",
    "Ioniq 5",
  ],
  Tata: [
    "Tiago",
    "Tigor",
    "Nexon",
    "Harrier",
    "Safari",
    "Punch",
    "Altroz",
    "Curvv",
    "Tiago EV",
    "Tigor EV",
    "Nexon EV",
    "Punch EV",
  ],
  Mahindra: [
    "Scorpio",
    "Scorpio N",
    "Thar",
    "XUV700",
    "XUV 3XO",
    "Bolero",
    "Bolero Neo",
    "Marazzo",
    "XUV400",
    "Thar Roxx",
  ],
  Toyota: [
    "Innova Crysta",
    "Fortuner",
    "Glanza",
    "Urban Cruiser",
    "Camry",
    "Hilux",
    "Vellfire",
    "Innova Hycross",
  ],
  Kia: ["Seltos", "Sonet", "Carens", "Carnival"],
  Honda: ["City", "Amaze", "Elevate", "Jazz", "WR-V"],
  Renault: ["Kwid", "Triber", "Kiger"],
  Nissan: ["Magnite"],
  Skoda: ["Kushaq", "Slavia", "Octavia", "Superb"],
  Volkswagen: ["Taigun", "Virtus", "T-Roc", "Polo"],
  MG: [
    "Astor",
    "Hector",
    "Hector Plus",
    "Gloster",
    "ZS EV",
    "Comet EV",
    "Windsor EV",
  ],
  Citroen: ["C3", "C3 Aircross", "Basalt"],
  Force: ["Gurkha"],
  Isuzu: ["D-Max", "MU-X"],
  Jeep: ["Wrangler", "Meridian", "Compass"],
  BMW: ["X1", "X5", "X7", "3 Series", "i7", "Z4"],
  MercedesBenz: ["E-Class", "S-Class", "GLC"],
  Audi: ["A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
};

export default function Step1CarDetails({ onNext, defaultValues }: Props) {
  const [make, setMake] = useState(defaultValues.make || "");
  const [model, setModel] = useState(defaultValues.model || "");
  const [year, setYear] = useState<number | undefined>(defaultValues.year);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle make change and reset model
  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMake(e.target.value);
    setModel(""); // Reset model when make changes
  };

  const handleSubmit = async () => {
    if (!make || !model || !year) return;

    setLoading(true);
    setError(null);

    try {
      const result = await addCar({ make, model, year });
      console.log("🚗 Car saved:", result);

      // assume backend returns { car_id: "123" }
      onNext({ make, model, year }, result.car_id);
    } catch (err: any) {
      console.error("❌ Error saving car:", err.message || err);
      setError("Failed to save car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <label className="block mb-2 text-lg font-medium text-gray-700">
        Car Make
      </label>
      <select
        value={make}
        onChange={handleMakeChange}
        className="w-full border p-2 rounded mb-4 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Make</option>
        {Object.keys(carData)
          .sort()
          .map((carMake) => (
            <option key={carMake} value={carMake}>
              {carMake}
            </option>
          ))}
      </select>

      <label className="block mb-2 text-lg font-medium text-gray-700">
        Car Model
      </label>
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="w-full border p-2 rounded mb-4 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
        disabled={!make}
      >
        <option value="">Select Model</option>
        {make &&
          carData[make].sort().map((carModel) => (
            <option key={carModel} value={carModel}>
              {carModel}
            </option>
          ))}
      </select>

      <label className="block mb-2 text-lg font-medium text-gray-700">
        Year of Make
      </label>
      <input
        type="number"
        value={year ?? ""}
        onChange={(e) =>
          setYear(e.target.value ? Number(e.target.value) : undefined)
        }
        placeholder="Enter year (e.g., 2023)"
        min="1900"
        max="2025"
        className="w-full border p-2 rounded mb-4 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        disabled={!make || !model || !year || loading}
      >
        {loading ? "Saving..." : "Next Step →"}
      </button>
    </div>
  );
}
