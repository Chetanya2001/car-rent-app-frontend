import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./intercityCars.css";
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

function getDateAndTime(dateObj: Date) {
  const pad = (num: number) => num.toString().padStart(2, "0");
  return {
    date: `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
      dateObj.getDate()
    )}`,
    time: `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`,
  };
}

export default function IntercityCars() {
  const navigate = useNavigate();
  const now = new Date();

  const pickupDefault = new Date(now);
  pickupDefault.setDate(pickupDefault.getDate() + 1);
  pickupDefault.setHours(9, 0, 0, 0);

  const { date, time } = getDateAndTime(pickupDefault);

  const [cars, setCars] = useState<Car[]>([]);
  const [pickupCity, setPickupCity] = useState("Delhi");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(date);
  const [pickupTime, setPickupTime] = useState(time);
  const [dropCity, setDropCity] = useState("");

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

  const handleSearch = async () => {
    const pickup_datetime = new Date(
      `${pickupDate}T${pickupTime}`
    ).toISOString();

    const data = await searchCars({
      city: pickupCity,
      pickup_datetime,
      dropoff_datetime: pickup_datetime, // intercity handled per KM later
    });

    setCars(data.cars || []);
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => car.city === pickupCity);
  }, [cars, pickupCity]);

  return (
    <>
      <Navbar />

      {/* Filters */}
      <div className="searched-filters-panel">
        <label>
          Pickup City:
          <select
            value={pickupCity}
            onChange={(e) => {
              setPickupCity(e.target.value);
              setPickupLocation("");
            }}
          >
            <option value="Delhi">Delhi</option>
          </select>
        </label>

        {pickupCity === "Delhi" && (
          <label>
            Pickup Location:
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
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

        <label>
          Pickup Date:
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
          />
        </label>

        <label>
          Pickup Time:
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
          />
        </label>

        <label>
          Drop City:
          <select
            value={dropCity}
            onChange={(e) => setDropCity(e.target.value)}
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

        {/* Insurance ON by default */}
        <label className="searched-switch-label">
          Insure Trip:
          <span className="searched-switch">
            <input type="checkbox" checked readOnly />
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
          <h2>Intercity Cars Available</h2>
          <p>
            Found {filteredCars.length.toString().padStart(2, "0")} intercity
            cars with driver
          </p>
        </div>
      </div>

      {/* Cars */}
      <div className="searched-cars-container">
        {filteredCars.length === 0 ? (
          <p className="searched-no-cars">No cars available</p>
        ) : (
          <div className="searched-car-list">
            {filteredCars.map((car) => (
              <div key={car.id} className="searched-car-card">
                <div className="searched-car-image-wrapper">
                  <img
                    src={car.photos?.[0] || "/placeholder.png"}
                    className="searched-car-image"
                    alt=""
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
                  <p style={{ color: "#01d28e", fontSize: "0.9rem" }}>
                    Driver Included • Insurance Included
                  </p>
                </div>

                <div className="searched-car-actions">
                  <button
                    className="searched-btn-book"
                    onClick={() =>
                      navigate("/bookAcar", {
                        state: {
                          carId: car.id,
                          tripType: "intercity",
                          pickupCity,
                          pickupLocation,
                          dropCity,
                          pickupDate,
                          pickupTime,
                          insureTrip: true,
                          driverRequired: false,
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
                        state: { tripType: "intercity" },
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

      {/* Missing Features Section */}
      <div className="searched-cars-container">
        <h2 style={{ marginBottom: "1rem" }}>
          🚀 Advanced Intercity Features (Coming Soon)
        </h2>
        <ul style={{ lineHeight: "1.9", color: "#555" }}>
          <li>City-to-city distance calculation (Google Maps)</li>
          <li>Automatic driver allocation</li>
          <li>One-way / Round-trip selection</li>
          <li>Multi-city route planner</li>
          <li>Night driving surcharge</li>
          <li>Toll & state tax breakdown</li>
          <li>Driver profile & ratings</li>
          <li>Live GPS tracking</li>
          <li>Emergency SOS button</li>
          <li>Per-KM cancellation rules</li>
          <li>Open return bookings</li>
          <li>Corporate & bulk bookings</li>
          <li>AI-based dynamic pricing</li>
        </ul>
      </div>
    </>
  );
}
