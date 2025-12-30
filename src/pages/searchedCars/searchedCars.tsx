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

// Helper to format date and time to YYYY-MM-DD and HH:MM
function getDateAndTime(dateObj: Date) {
  const pad = (num: number) => num.toString().padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  const mm = pad(dateObj.getMonth() + 1);
  const dd = pad(dateObj.getDate());
  const date = `${yyyy}-${mm}-${dd}`;
  const hh = pad(dateObj.getHours());
  const mins = pad(dateObj.getMinutes());
  const time = `${hh}:${mins}`;
  return { date, time };
}

export default function SearchedCars() {
  const location = useLocation();
  const navigate = useNavigate();

  const now = new Date();

  // Pickup default
  const { date: todayDate } = getDateAndTime(now);
  const pickupTimeDefault = "09:00";

  // Dropoff default (today + 4 days)
  const dropDefault = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
  const { date: dropDateDefault } = getDateAndTime(dropDefault);
  const dropTimeDefault = "17:00";

  const [cars, setCars] = useState<Car[]>(location.state?.cars || []);
  const bookingDetails = location.state?.bookingDetails || {};

  const [mode, setMode] = useState<"selfdrive" | "intercity">("selfdrive");

  const [filters, setFilters] = useState({
    city: bookingDetails.city || "Delhi",
    pickupDate: bookingDetails.pickupDate || todayDate,
    pickupTime: bookingDetails.pickupTime || pickupTimeDefault,
    dropDate: bookingDetails.dropDate || dropDateDefault,
    dropTime: bookingDetails.dropTime || dropTimeDefault,
    insureTrip: bookingDetails.insureTrip ?? true,
    driverRequired: bookingDetails.driverRequired ?? false,
    differentDrop: bookingDetails.differentDrop ?? false,
  });

  const [pickupLocation, setPickupLocation] = useState(""); // For Intercity Delhi specific locations
  const [dropCity, setDropCity] = useState(
    location.state?.bookingDetails?.dropCity || ""
  );
  const [showDropMap, setShowDropMap] = useState(false);

  // Cities list
  const cities = ["Delhi", "Gurgaon", "Noida", "Agra", "Ahmedabad", "Jaipur"];

  // Delhi specific pickup points
  const delhiPickupPoints = [
    "Indira Gandhi International Airport (DEL)",
    "New Delhi Railway Station",
    "Hazrat Nizamuddin Railway Station",
    "Anand Vihar Railway Station",
    "Old Delhi Railway Station",
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      city: e.target.value,
    }));
    setPickupLocation(""); // Reset pickup location when city changes
  };

  const handleDropCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDropCity(e.target.value);
  };

  const handleSearch = async () => {
    if (!filters.city || !filters.pickupDate || !filters.dropDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const searchPayload: any = {
        city: filters.city,
        pickup_datetime: filters.pickupDate + "T" + filters.pickupTime,
        dropoff_datetime: filters.dropDate + "T" + filters.dropTime,
      };

      if (mode === "intercity" && dropCity) {
        searchPayload.drop_city = dropCity;
      }

      const data = await searchCars(searchPayload);
      setCars(data.cars || []);
    } catch (err) {
      console.error("❌ Error searching cars:", err);
      alert("Failed to fetch cars. Try again.");
    }
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (
        filters.city &&
        car.city &&
        car.city.toLowerCase() !== filters.city.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.pickupDate &&
        filters.pickupTime &&
        filters.dropDate &&
        filters.dropTime
      ) {
        const pickup = new Date(`${filters.pickupDate}T${filters.pickupTime}`);
        const drop = new Date(`${filters.dropDate}T${filters.dropTime}`);

        if (car.availableFrom && car.availableTo) {
          const availableFrom = new Date(car.availableFrom);
          const availableTo = new Date(car.availableTo);

          if (pickup < availableFrom || drop > availableTo) {
            return false;
          }
        }
      }

      return true;
    });
  }, [cars, filters]);

  // Effective values for intercity mode
  const effectiveInsureTrip = mode === "intercity" ? true : filters.insureTrip;
  const effectiveDriverRequired =
    mode === "intercity" ? false : filters.driverRequired;

  return (
    <>
      <Navbar />

      {/* Mode Toggle */}
      <div className="searched-filters-panel" style={{ paddingTop: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "15px",
          }}
        >
          <span
            style={{ fontWeight: mode === "selfdrive" ? "bold" : "normal" }}
          >
            Self Drive
          </span>
          <label className="searched-switch-label" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={mode === "intercity"}
              onChange={(e) =>
                setMode(e.target.checked ? "intercity" : "selfdrive")
              }
            />
            <span
              className="searched-slider"
              style={{ transform: "scale(1.2)" }}
            ></span>
          </label>
          <span
            style={{ fontWeight: mode === "intercity" ? "bold" : "normal" }}
          >
            Intercity Self Drive
          </span>
        </div>

        {/* Conditional Filters based on Mode */}
        {mode === "selfdrive" ? (
          <>
            <label>
              City:
              <select
                name="city"
                value={filters.city}
                onChange={handleCityChange}
                style={{ padding: "6px", fontSize: "1rem" }}
              >
                <option value="" disabled>
                  Select City
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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

            {/* Self Drive Toggles */}
            <label className="searched-switch-label">
              Insure Trip:
              <span className="searched-switch">
                <input
                  type="checkbox"
                  name="insureTrip"
                  checked={filters.insureTrip}
                  onChange={handleFilterChange}
                />
                <span className="searched-slider"></span>
              </span>
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
                <span className="searched-slider"></span>
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
                <span className="searched-slider"></span>
              </span>
            </label>

            {filters.differentDrop && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  value={dropCity}
                  onChange={handleDropCityChange}
                  style={{ flexGrow: 1, padding: "6px", fontSize: "1rem" }}
                >
                  <option value="" disabled>
                    Select Drop-off City
                  </option>
                  {cities
                    .filter((c) => c !== filters.city)
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => setShowDropMap(true)}
                />
              </div>
            )}
          </>
        ) : (
          /* Intercity Mode */
          <>
            <label>
              Pickup City:
              <select
                name="city"
                value={filters.city}
                onChange={handleCityChange}
                style={{ padding: "6px", fontSize: "1rem" }}
              >
                <option value="" disabled>
                  Select Pickup City
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            {/* Delhi Specific Pickup Points */}
            {filters.city === "Delhi" && (
              <label>
                Pickup Location:
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  style={{ padding: "6px", fontSize: "1rem" }}
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  {delhiPickupPoints.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
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
              Drop City:
              <select
                value={dropCity}
                onChange={handleDropCityChange}
                style={{ padding: "6px", fontSize: "1rem" }}
              >
                <option value="" disabled>
                  Select Drop City
                </option>
                {cities
                  .filter((c) => c !== filters.city)
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
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

            {/* Fixed for Intercity */}
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <span>
                Insure Trip: <strong>ON</strong>
              </span>
              <span>
                Driver Required: <strong>NO</strong>
              </span>
            </div>
          </>
        )}

        <button className="searched-search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Banner */}
      <div className="searched-results-banner">
        <div className="searched-banner-content">
          <h2>Your Search results</h2>
          <p>
            Found {filteredCars.length.toString().padStart(2, "0")} cars for
            your dates &amp; location, happy Zipping!
          </p>
        </div>
      </div>

      {/* Car Listing */}
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
                  {car.photos && car.photos.length > 0 ? (
                    <img
                      src={car.photos[0]}
                      alt={`${car.make} ${car.model}`}
                      className="searched-car-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="searched-car-placeholder">No Image</div>
                  )}
                </div>
                <div className="searched-car-info">
                  <h3>
                    {car.make} {car.model}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p className="searched-car-price">
                    ₹{car.price_per_hour} / hour
                  </p>
                </div>
                <div className="searched-car-actions">
                  <button
                    className="searched-btn-book"
                    onClick={() =>
                      navigate("/bookAcar", {
                        state: {
                          carId: car.id,
                          pricePerHour: car.price_per_hour,
                          bookingDetails: {
                            mode,
                            pickupDate: filters.pickupDate,
                            pickupTime: filters.pickupTime,
                            dropDate: filters.dropDate,
                            dropTime: filters.dropTime,
                            city: filters.city,
                            dropCity:
                              mode === "intercity" ? dropCity : undefined,
                            pickupLocation:
                              mode === "intercity" && filters.city === "Delhi"
                                ? pickupLocation
                                : undefined,
                            insureTrip: effectiveInsureTrip,
                            driverRequired: effectiveDriverRequired,
                            differentDrop:
                              mode === "selfdrive"
                                ? filters.differentDrop
                                : false,
                          },
                        },
                      })
                    }
                  >
                    Book now
                  </button>
                  <button
                    className="searched-btn-details"
                    onClick={() =>
                      navigate(`/car-details/${car.id}`, {
                        state: {
                          pickup_datetime:
                            filters.pickupDate + "T" + filters.pickupTime,
                          dropoff_datetime:
                            filters.dropDate + "T" + filters.dropTime,
                          insurance: effectiveInsureTrip,
                          driver: effectiveDriverRequired,
                          differentDrop:
                            mode === "selfdrive"
                              ? filters.differentDrop
                              : false,
                          dropCity: mode === "intercity" ? dropCity : undefined,
                          price_per_hour: car.price_per_hour,
                        },
                      })
                    }
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drop-off Map Modal (only for Self Drive different drop) */}
      {showDropMap && mode === "selfdrive" && (
        <ModalWrapper onClose={() => setShowDropMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              const locationName =
                loc.city && loc.state
                  ? `${loc.city}, ${loc.state}`
                  : loc.city || loc.state || loc.country || "";
              setDropCity(locationName);
              setShowDropMap(false);
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
}
