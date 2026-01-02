import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchedCars.css";
import Navbar from "../../components/Navbar/Navbar";
import ModalWrapper from "../../components/ModalWrapper/ModalWrapper";
import LocationPicker from "../../components/Map/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
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

function getDateAndTime(dateObj: Date) {
  const pad = (num: number) => num.toString().padStart(2, "0");
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

  const pickupDefault = new Date(now);
  pickupDefault.setDate(pickupDefault.getDate() + 1);
  pickupDefault.setHours(9, 0, 0, 0);

  const dropoffDefault = new Date(now);
  dropoffDefault.setDate(dropoffDefault.getDate() + 4);
  dropoffDefault.setHours(17, 0, 0, 0);

  const { date: defaultPickupDate, time: defaultPickupTime } =
    getDateAndTime(pickupDefault);
  const { date: defaultDropoffDate, time: defaultDropoffTime } =
    getDateAndTime(dropoffDefault);

  const bookingDetails = location.state?.bookingDetails || {};
  const initialCars = location.state?.cars || [];

  const [cars, setCars] = useState<Car[]>(initialCars);

  const [filters, setFilters] = useState({
    city: bookingDetails.city || "Delhi",
    pickupDate: bookingDetails.pickupDate || defaultPickupDate,
    pickupTime: bookingDetails.pickupTime || defaultPickupTime,
    dropDate: bookingDetails.dropDate || defaultDropoffDate,
    dropTime: bookingDetails.dropTime || defaultDropoffTime,
    driverRequired: bookingDetails.driverRequired ?? false,
    differentDrop: bookingDetails.differentDrop ?? false,
    insureTrip: bookingDetails.insureTrip ?? true,
  });

  const [dropCity, setDropCity] = useState("");
  const [showDropMap, setShowDropMap] = useState(false);

  const cities = ["Delhi", "Gurgaon", "Noida", "Agra", "Ahmedabad", "Jaipur"];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async () => {
    try {
      const pickupDateTime = new Date(
        `${filters.pickupDate}T${filters.pickupTime}`
      ).toISOString();

      const dropoffDateTime = new Date(
        `${filters.dropDate}T${filters.dropTime}`
      ).toISOString();

      const data = await searchCars({
        city: filters.city,
        pickup_datetime: pickupDateTime,
        dropoff_datetime: dropoffDateTime,
      });

      setCars(data.cars || []);
    } catch {
      alert("Failed to fetch cars");
    }
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        filters.city &&
        car.city &&
        car.city.toLowerCase() !== filters.city.toLowerCase()
      )
        return false;

      const pickup = new Date(`${filters.pickupDate}T${filters.pickupTime}`);
      const drop = new Date(`${filters.dropDate}T${filters.dropTime}`);

      if (car.availableFrom && car.availableTo) {
        const from = new Date(car.availableFrom);
        const to = new Date(car.availableTo);
        if (pickup < from || drop > to) return false;
      }

      return true;
    });
  }, [cars, filters]);

  return (
    <>
      <Navbar />

      {/* FILTER PANEL — UNCHANGED */}
      <div className="searched-filters-panel">
        <label>
          Pickup City:
          <select
            value={filters.city}
            onChange={(e) =>
              setFilters((p) => ({ ...p, city: e.target.value }))
            }
          >
            <option value="" disabled>
              Select City
            </option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>

        <label>
          Pickup Date:
          <input
            type="date"
            name="pickupDate"
            value={filters.pickupDate}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Pickup Time:
          <input
            type="time"
            name="pickupTime"
            value={filters.pickupTime}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Dropoff Date:
          <input
            type="date"
            name="dropDate"
            value={filters.dropDate}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Dropoff Time:
          <input
            type="time"
            name="dropTime"
            value={filters.dropTime}
            onChange={handleFilterChange}
          />
        </label>

        <label className="searched-switch-label">
          Driver Required:
          <span className="searched-switch">
            <input
              type="checkbox"
              name="driverRequired"
              checked={filters.driverRequired}
              onChange={handleFilterChange}
            />
            <span className="searched-slider" />
          </span>
        </label>

        <label className="searched-switch-label">
          Different Drop Location:
          <span className="searched-switch">
            <input
              type="checkbox"
              name="differentDrop"
              checked={filters.differentDrop}
              onChange={handleFilterChange}
            />
            <span className="searched-slider" />
          </span>
        </label>

        {filters.differentDrop && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <select
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              style={{ flexGrow: 1 }}
            >
              <option value="" disabled>
                Select Drop-off City
              </option>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>

            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              style={{ marginLeft: "8px", cursor: "pointer" }}
              onClick={() => setShowDropMap(true)}
            />
          </div>
        )}

        <label className="searched-switch-label">
          Insure Trip:
          <span className="searched-switch">
            <input
              type="checkbox"
              name="insureTrip"
              checked={filters.insureTrip}
              onChange={handleFilterChange}
            />
            <span className="searched-slider" />
          </span>
        </label>

        <button className="searched-search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* BANNER — KEPT */}
      <div className="searched-results-banner">
        <div className="searched-banner-content">
          <h2>Your Search results</h2>
          <p>
            Found {filteredCars.length.toString().padStart(2, "0")} cars for
            your dates & location, happy Zipping!
          </p>
        </div>
      </div>

      {/* CAR LIST — KEPT */}
      <div className="searched-cars-container">
        {filteredCars.length === 0 ? (
          <p className="searched-no-cars">
            No cars found for the selected criteria.
          </p>
        ) : (
          <div className="searched-car-list">
            {filteredCars.map((car) => (
              <div key={car.id} className="searched-car-card">
                <div className="searched-car-image-wrapper">
                  <img
                    src={car.photos?.[0] || "/placeholder.png"}
                    className="searched-car-image"
                    alt={`${car.make} ${car.model}`}
                  />
                </div>

                <div className="searched-car-info">
                  <h3>
                    {car.make} {car.model}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p className="searched-car-price">
                    ₹{car.price_per_hour} / hour
                  </p>
                  {filters.insureTrip && (
                    <p style={{ color: "#01d28e", fontSize: "0.9rem" }}>
                      Trip Insurance Included
                    </p>
                  )}
                </div>

                <div className="searched-car-actions">
                  <button
                    className="searched-btn-book"
                    onClick={() =>
                      navigate("/bookAcar", {
                        state: {
                          carId: car.id,
                          pricePerHour: car.price_per_hour,
                          bookingDetails: { ...filters, dropCity },
                        },
                      })
                    }
                  >
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDropMap && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              setDropCity(
                loc.city && loc.state
                  ? `${loc.city}, ${loc.state}`
                  : loc.city || ""
              );
              setShowDropMap(false);
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
}
