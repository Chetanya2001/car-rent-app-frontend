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

export default function SearchedCars() {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingDetails = location.state?.bookingDetails || {};
  const initialCars = location.state?.cars || [];

  const [cars, setCars] = useState<Car[]>(initialCars);

  const [filters, setFilters] = useState({
    city: bookingDetails.city || "Delhi",
    pickupDate: bookingDetails.pickupDate,
    pickupTime: bookingDetails.pickupTime,
    dropDate: bookingDetails.dropDate,
    dropTime: bookingDetails.dropTime,
    driverRequired: bookingDetails.driverRequired ?? false,
    differentDrop: bookingDetails.differentDrop ?? false,
    insureTrip: bookingDetails.insureTrip ?? true,
  });

  const [dropCity, setDropCity] = useState("");
  const [showDropMap, setShowDropMap] = useState(false);

  const cities = ["Delhi", "Gurgaon", "Noida", "Agra", "Jaipur"];

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSearch = async () => {
    const pickup = new Date(
      `${filters.pickupDate}T${filters.pickupTime}`
    ).toISOString();
    const drop = new Date(
      `${filters.dropDate}T${filters.dropTime}`
    ).toISOString();

    const res = await searchCars({
      city: filters.city,
      pickup_datetime: pickup,
      dropoff_datetime: drop,
    });

    setCars(res.cars || []);
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.city && car.city !== filters.city) return false;
      return true;
    });
  }, [cars, filters.city]);

  return (
    <>
      <Navbar />

      {/* Filters */}
      <div className="searched-filters-panel">
        <label>
          City:
          <select
            value={filters.city}
            onChange={(e) =>
              setFilters((p) => ({ ...p, city: e.target.value }))
            }
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
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
          Drop Date:
          <input
            type="date"
            name="dropDate"
            value={filters.dropDate}
            onChange={handleFilterChange}
          />
        </label>

        <label>
          Drop Time:
          <input
            type="time"
            name="dropTime"
            value={filters.dropTime}
            onChange={handleFilterChange}
          />
        </label>

        <label className="searched-switch-label">
          Driver Required
          <input
            type="checkbox"
            name="driverRequired"
            checked={filters.driverRequired}
            onChange={handleFilterChange}
          />
        </label>

        <label className="searched-switch-label">
          Different Drop
          <input
            type="checkbox"
            name="differentDrop"
            checked={filters.differentDrop}
            onChange={handleFilterChange}
          />
        </label>

        {filters.differentDrop && (
          <div>
            <select onChange={(e) => setDropCity(e.target.value)}>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              onClick={() => setShowDropMap(true)}
            />
          </div>
        )}

        <label className="searched-switch-label">
          Insure Trip
          <input
            type="checkbox"
            name="insureTrip"
            checked={filters.insureTrip}
            onChange={handleFilterChange}
          />
        </label>

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Cars */}
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
                    bookingDetails: { ...filters, dropCity },
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
          <LocationPicker
            onSelect={(loc: any) => {
              setDropCity(loc.city || "");
              setShowDropMap(false);
            }}
          />
        </ModalWrapper>
      )}
    </>
  );
}
