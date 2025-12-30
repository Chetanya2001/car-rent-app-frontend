import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchedCars.css";
import Navbar from "../../components/Navbar/Navbar";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import LocationPicker from "../../components/Map/LocationPicker";
import { searchCars } from "../../services/carService";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  photos: string[];
  city?: string;
  availableFrom: string;
  availableTo: string;
}

/* -------------------- CITY → STATIONS MAP -------------------- */
const CITY_STATIONS: Record<string, string[]> = {
  Delhi: [
    "New Delhi Railway Station",
    "Old Delhi Railway Station",
    "Hazrat Nizamuddin",
    "IGI Airport",
  ],
  Agra: ["Agra Cantt", "Agra Fort", "Kheria Airport"],
  Jaipur: ["Jaipur Junction", "Gandhi Nagar", "Jaipur Airport"],
  Noida: ["Noida Sector 18", "Noida City Center"],
};

/* -------------------- DATE UTILS -------------------- */
function getDateAndTime(dateObj: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    date: `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
      dateObj.getDate()
    )}`,
    time: `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`,
  };
}

export default function SearchedCars() {
  const location = useLocation();
  const navigate = useNavigate();

  const now = new Date();
  const { date: todayDate } = getDateAndTime(now);

  const [tripType, setTripType] = useState<"selfdrive" | "intercity">(
    "selfdrive"
  );

  const [cars, setCars] = useState<Car[]>(location.state?.cars || []);

  const [filters, setFilters] = useState({
    city: "Delhi",
    pickupLocation: "",
    pickupDate: todayDate,
    pickupTime: "09:00",
    dropDate: todayDate,
    dropTime: "17:00",
    insureTrip: true,
    driverRequired: false,
    differentDrop: false,
  });

  const [dropCity, setDropCity] = useState("");
  const [showDropMap, setShowDropMap] = useState(false);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFilters((p) => ({
      ...p,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSearch = async () => {
    try {
      const data = await searchCars({
        city: filters.city,
        pickup_datetime: `${filters.pickupDate}T${filters.pickupTime}`,
        dropoff_datetime: `${filters.dropDate}T${filters.dropTime}`,
      });
      setCars(data.cars || []);
    } catch {
      alert("Failed to fetch cars");
    }
  };

  /* -------------------- FILTERED CARS -------------------- */
  const filteredCars = useMemo(() => cars, [cars]);

  /* -------------------- UI -------------------- */
  return (
    <>
      <Navbar />

      {/* -------- Trip Toggle -------- */}
      <div className="trip-toggle">
        <button
          className={tripType === "selfdrive" ? "active" : ""}
          onClick={() => setTripType("selfdrive")}
        >
          Self Drive
        </button>
        <button
          className={tripType === "intercity" ? "active" : ""}
          onClick={() => setTripType("intercity")}
        >
          Intercity
        </button>
      </div>

      {/* -------- Filters -------- */}
      <div className="searched-filters-panel">
        {/* Pickup City */}
        <label>
          Pickup City:
          <select name="city" value={filters.city} onChange={handleChange}>
            {Object.keys(CITY_STATIONS).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        {/* Intercity Pickup Location */}
        {tripType === "intercity" && (
          <label>
            Pickup Location:
            <select
              name="pickupLocation"
              value={filters.pickupLocation}
              onChange={handleChange}
            >
              <option value="">Select Station</option>
              {CITY_STATIONS[filters.city]?.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        )}

        <label>
          Pickup Date:
          <input
            type="date"
            name="pickupDate"
            value={filters.pickupDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Pickup Time:
          <input
            type="time"
            name="pickupTime"
            value={filters.pickupTime}
            onChange={handleChange}
          />
        </label>

        {/* Drop City (Intercity only) */}
        {tripType === "intercity" && (
          <label>
            Drop City:
            <select
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
            >
              <option value="">Select</option>
              {Object.keys(CITY_STATIONS)
                .filter((c) => c !== filters.city)
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </label>
        )}

        {/* Self Drive options */}
        {tripType === "selfdrive" && (
          <>
            <label>
              Driver Required:
              <input
                type="checkbox"
                name="driverRequired"
                checked={filters.driverRequired}
                onChange={handleChange}
              />
            </label>

            <label>
              Insure Trip:
              <input
                type="checkbox"
                name="insureTrip"
                checked={filters.insureTrip}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* -------- Cars -------- */}
      <div className="searched-cars-container">
        {filteredCars.map((car) => (
          <div key={car.id} className="searched-car-card">
            <img src={car.photos?.[0]} alt="" />
            <h3>
              {car.make} {car.model}
            </h3>
            <p>₹{car.price_per_hour}/hr</p>

            <button
              onClick={() =>
                navigate("/bookAcar", {
                  state: {
                    carId: car.id,
                    tripType,
                    bookingDetails: {
                      ...filters,
                      dropCity,
                      driverRequired:
                        tripType === "intercity"
                          ? false
                          : filters.driverRequired,
                      insureTrip:
                        tripType === "intercity" ? true : filters.insureTrip,
                    },
                  },
                })
              }
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {showDropMap && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker onSelect={() => setShowDropMap(false)} />
        </ModalWrapper>
      )}
    </>
  );
}
