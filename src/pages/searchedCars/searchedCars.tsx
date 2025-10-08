import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchedCars.css";
import Navbar from "../../components/Navbar/Navbar";
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

  // Current date and time (IST): 2025-10-08 14:59
  const now = new Date(2025, 9, 8, 14, 59); // JS months are 0-based

  // Get default pickup (today now) and dropoff (tomorrow same time)
  const { date: todayDate, time: nowTime } = getDateAndTime(now);
  const dropDefault = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const { date: tomorrowDate, time: dropTime } = getDateAndTime(dropDefault);

  const [cars, setCars] = useState<Car[]>(location.state?.cars || []);
  const bookingDetails = location.state?.bookingDetails || {};

  const [filters, setFilters] = useState({
    city: bookingDetails.city || "Delhi",
    pickupDate: bookingDetails.pickupDate || todayDate,
    pickupTime: bookingDetails.pickupTime || nowTime,
    dropDate: bookingDetails.dropDate || tomorrowDate,
    dropTime: bookingDetails.dropTime || dropTime,
    insureTrip: bookingDetails.insureTrip ?? false,
    driverRequired: bookingDetails.driverRequired ?? false,
    differentDrop: bookingDetails.differentDrop ?? false,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async () => {
    if (!filters.city || !filters.pickupDate || !filters.dropDate) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await searchCars({
        city: filters.city,
        pickup_datetime: filters.pickupDate + "T" + filters.pickupTime,
        dropoff_datetime: filters.dropDate + "T" + filters.dropTime,
      });
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

  return (
    <>
      <Navbar />

      {/* Filters with Search Button */}
      <div className="searched-filters-panel">
        <label>
          City:
          <input
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="Enter city"
            autoComplete="off"
          />
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

        {/* Toggles */}
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
                      navigate(`/car-details/${car.id}`, {
                        state: {
                          pickup_datetime:
                            filters.pickupDate + "T" + filters.pickupTime,
                          dropoff_datetime:
                            filters.dropDate + "T" + filters.dropTime,
                          insurance: filters.insureTrip,
                          driver: filters.driverRequired,
                          differentDrop: filters.differentDrop,
                          price_per_hour: car.price_per_hour,
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
                          insurance: filters.insureTrip,
                          driver: filters.driverRequired,
                          differentDrop: filters.differentDrop,
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
    </>
  );
}
