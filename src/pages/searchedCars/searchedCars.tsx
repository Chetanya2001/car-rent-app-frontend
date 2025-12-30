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
  now.setHours(now.getHours() + 2);

  const { date: todayDate, time: nowTime } = getDateAndTime(now);
  const dropDefault = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { date: tomorrowDate, time: dropTime } = getDateAndTime(dropDefault);

  const bookingDetails = location.state?.bookingDetails || {};
  const initialCars = location.state?.cars || [];

  const [tripType, setTripType] = useState<"selfdrive" | "intercity">(
    "selfdrive"
  );

  const [cars, setCars] = useState<Car[]>(initialCars);

  const [filters, setFilters] = useState({
    city: bookingDetails.city || "Delhi",
    pickupDate: bookingDetails.pickupDate || todayDate,
    pickupTime: bookingDetails.pickupTime || nowTime,
    dropDate: bookingDetails.dropDate || tomorrowDate,
    dropTime: bookingDetails.dropTime || dropTime,
    driverRequired: bookingDetails.driverRequired ?? false,
    differentDrop: bookingDetails.differentDrop ?? false,
    insureTrip: bookingDetails.insureTrip ?? true, // Default ON
  });

  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [dropCity, setDropCity] = useState<string>("");

  const [showDropMap, setShowDropMap] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCityChange = (value: string) => {
    setFilters((prev) => ({ ...prev, city: value }));
    if (tripType === "intercity" && value !== "Delhi") {
      setPickupLocation("");
    }
  };

  const handleSearch = async () => {
    if (!filters.city || !filters.pickupDate || !filters.dropDate) {
      alert("Please fill all required fields");
      return;
    }

    if (tripType === "intercity") {
      if (filters.city === "Delhi" && !pickupLocation) {
        alert("Please select a pickup location in Delhi");
        return;
      }
      if (!dropCity) {
        alert("Please select a drop city");
        return;
      }
    }

    try {
      const searchParams: any = {
        city: filters.city,
        pickup_datetime: `${filters.pickupDate}T${filters.pickupTime}`,
        dropoff_datetime: `${filters.dropDate}T${filters.dropTime}`,
      };

      if (tripType === "intercity") {
        searchParams.intercity = true;
        if (pickupLocation) searchParams.pickup_location = pickupLocation;
        if (dropCity) searchParams.drop_city = dropCity;
      }

      const data = await searchCars(searchParams);
      setCars(data.cars || []);
    } catch (err) {
      console.error("Error searching cars:", err);
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

      const pickup = new Date(`${filters.pickupDate}T${filters.pickupTime}`);
      const drop = new Date(`${filters.dropDate}T${filters.dropTime}`);

      if (car.availableFrom && car.availableTo) {
        const availableFrom = new Date(car.availableFrom);
        const availableTo = new Date(car.availableTo);
        if (pickup < availableFrom || drop > availableTo) return false;
      }

      return true;
    });
  }, [cars, filters]);

  const delhiPickupLocations = [
    "Indira Gandhi International Airport (DEL)",
    "New Delhi Railway Station (NDLS)",
    "Old Delhi Railway Station (DLI)",
    "Hazrat Nizamuddin Railway Station (NZM)",
    "Anand Vihar Terminal (ANVT)",
  ];

  const intercityDropCities = [
    "Agra",
    "Jaipur",
    "Chandigarh",
    "Lucknow",
    "Dehradun",
    "Amritsar",
  ];

  return (
    <>
      <Navbar />

      {/* Trip Type Toggle */}
      <div className="trip-type-toggle-container">
        <span className={tripType === "selfdrive" ? "active" : ""}>
          Self Drive
        </span>
        <div
          className="trip-type-switch"
          onClick={() =>
            setTripType(tripType === "selfdrive" ? "intercity" : "selfdrive")
          }
        >
          <div className={`switch-knob ${tripType}`} />
        </div>
        <span className={tripType === "intercity" ? "active" : ""}>
          Intercity Self Drive
        </span>
      </div>

      {/* Filters Panel */}
      <div className="searched-filters-panel">
        {/* Pickup City */}
        <label>
          Pickup City:
          {tripType === "intercity" ? (
            <select
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              style={{ padding: "6px", fontSize: "1rem" }}
            >
              <option value="Delhi">Delhi</option>
            </select>
          ) : (
            <select
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              style={{ padding: "6px", fontSize: "1rem" }}
            >
              <option value="" disabled>
                Select City
              </option>
              <option value="Delhi">Delhi</option>
              <option value="Gurgaon">Gurgaon</option>
              <option value="Noida">Noida</option>
              <option value="Agra">Agra</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          )}
        </label>

        {/* Intercity: Pickup Location */}
        {tripType === "intercity" && filters.city === "Delhi" && (
          <label>
            Pickup Location:
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              style={{ padding: "6px", fontSize: "1rem" }}
              required
            >
              <option value="" disabled>
                Select Location
              </option>
              {delhiPickupLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Dates & Times */}
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

        {/* Intercity: Drop City */}
        {tripType === "intercity" && (
          <label>
            Drop City:
            <select
              value={dropCity}
              onChange={(e) => setDropCity(e.target.value)}
              style={{ padding: "6px", fontSize: "1rem" }}
              required
            >
              <option value="" disabled>
                Select Drop City
              </option>
              {intercityDropCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Common Options: Driver Required (only selfdrive) + Insurance (both) */}
        {tripType === "selfdrive" && (
          <>
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
                  onChange={(e) => setDropCity(e.target.value)}
                  style={{ flexGrow: 1, padding: "6px", fontSize: "1rem" }}
                >
                  <option value="" disabled>
                    Select Drop-off City
                  </option>
                  <option value="Noida">Noida</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Agra">Agra</option>
                  <option value="Meerut">Meerut</option>
                </select>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => setShowDropMap(true)}
                />
              </div>
            )}
          </>
        )}

        {/* Trip Insurance Toggle — Visible in BOTH modes, default ON */}
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
            your dates & location, happy Zipping!
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
                  {filters.insureTrip && (
                    <p
                      style={{
                        color: "#01d28e",
                        fontSize: "0.9rem",
                        marginTop: "0.5rem",
                      }}
                    >
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
                          bookingDetails: {
                            ...filters,
                            tripType,
                            pickupLocation:
                              tripType === "intercity"
                                ? pickupLocation
                                : undefined,
                            dropCity:
                              tripType === "intercity"
                                ? dropCity
                                : filters.differentDrop
                                ? dropCity
                                : undefined,
                            driverRequired:
                              tripType === "intercity"
                                ? false
                                : filters.driverRequired,
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
                          pickup_datetime: `${filters.pickupDate}T${filters.pickupTime}`,
                          dropoff_datetime: `${filters.dropDate}T${filters.dropTime}`,
                          insurance: filters.insureTrip,
                          driver:
                            tripType === "intercity"
                              ? false
                              : filters.driverRequired,
                          differentDrop:
                            tripType === "selfdrive"
                              ? filters.differentDrop
                              : false,
                          dropCity:
                            tripType === "intercity" ? dropCity : dropCity,
                          price_per_hour: car.price_per_hour,
                          tripType,
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

      {/* Drop Map Modal */}
      {showDropMap && tripType === "selfdrive" && (
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
