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
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [showPickupOptions, setShowPickupOptions] = useState(false);
  const [showPickupMap, setShowPickupMap] = useState(false);

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

      {/* FILTER PANEL */}
      <div className="searched-filters-panel">
        <label>
          Pickup Location:
          <div className="location-input-container">
            <input
              type="text"
              readOnly
              value={
                pickupLocation
                  ? `${pickupLocation.city}, ${pickupLocation.state}`
                  : ""
              }
              placeholder="Select Pickup Location"
              onClick={() => setShowPickupOptions(true)}
              className="location-input-field"
            />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
          </div>
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

      {/* BANNER */}
      <div className="searched-results-banner">
        <div className="searched-banner-content">
          <h2>Your Search results</h2>
          <p>
            Found {filteredCars.length.toString().padStart(2, "0")} cars for
            your dates & location, happy Zipping!
          </p>
        </div>
      </div>

      {/* CAR LIST */}
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

      {/* PICKUP OPTIONS MODAL */}
      {showPickupOptions && (
        <ModalWrapper onClose={() => setShowPickupOptions(false)}>
          <div
            className="location-modal-overlay"
            onClick={() => setShowPickupOptions(false)}
          >
            <div
              className="location-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="location-modal-header">
                <h2>Select Pickup Location</h2>
                <p>Choose how you'd like to set your pickup address</p>
              </div>

              <div className="location-modal-body">
                <button
                  className="location-option-btn current-location"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;

                        const res = await fetch(
                          `https://us1.locationiq.com/v1/reverse?key=${
                            import.meta.env.VITE_LOCATIONIQ_TOKEN
                          }&lat=${lat}&lon=${lng}&format=json`
                        );

                        const data = await res.json();

                        setPickupLocation({
                          city:
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            "",
                          state: data.address.state || "",
                          country: data.address.country || "",
                          lat,
                          lng,
                        });

                        setShowPickupOptions(false);
                      },
                      () => alert("Location permission denied")
                    );
                  }}
                >
                  <div className="option-icon">📍</div>
                  <div className="option-content">
                    <h3>Use Current Location</h3>
                    <p>Automatically detect your current position</p>
                  </div>
                </button>

                <button
                  className="location-option-btn map-location"
                  onClick={() => {
                    setShowPickupOptions(false);
                    setShowPickupMap(true);
                  }}
                >
                  <div className="option-icon">🗺️</div>
                  <div className="option-content">
                    <h3>Pick on Map</h3>
                    <p>Choose a location by browsing the map</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* PICKUP MAP MODAL */}
      {showPickupMap && (
        <ModalWrapper onClose={() => setShowPickupMap(false)}>
          <LocationPicker
            onSelect={(loc: any) => {
              setPickupLocation(loc);
              setShowPickupMap(false);
            }}
          />
        </ModalWrapper>
      )}

      {/* DROP MAP MODAL */}
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

      <style>{`
        /* Modal Styling */
        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .location-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .location-modal-header {
          background: linear-gradient(135deg, #01d28e 0%, #018f61 100%);
          color: white;
          padding: 32px 24px;
          text-align: center;
        }

        .location-modal-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .location-modal-header p {
          margin: 0;
          font-size: 14px;
          opacity: 0.95;
          font-weight: 400;
        }

        .location-modal-body {
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #fafafa;
        }

        .location-option-btn {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        }

        .location-option-btn:hover {
          border-color: #01d28e;
          background: #f0fdf7;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(1, 210, 142, 0.2);
        }

        .location-option-btn:active {
          transform: translateY(0);
        }

        .option-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0fdf7;
          border-radius: 12px;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .location-option-btn:hover .option-icon {
          background: #01d28e;
          transform: scale(1.1);
        }

        .option-content {
          flex: 1;
        }

        .option-content h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .option-content p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
        }

        @media (max-width: 600px) {
          .location-modal {
            max-width: 100%;
            margin: 0 10px;
          }

          .location-modal-header {
            padding: 24px 20px;
          }

          .location-modal-header h2 {
            font-size: 20px;
          }

          .location-modal-header p {
            font-size: 13px;
          }

          .location-modal-body {
            padding: 20px 16px;
          }

          .location-option-btn {
            padding: 16px;
            gap: 16px;
          }

          .option-icon {
            width: 50px;
            height: 50px;
            font-size: 26px;
          }

          .option-content h3 {
            font-size: 16px;
          }

          .option-content p {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
