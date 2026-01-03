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
  availableFrom?: string;
  availableTo?: string;
  available_from?: string;
  available_till?: string;
  documents?: {
    car_id: number;
    insurance_company: string;
    insurance_idv_value: string;
    insurance_image: string;
    owner_name: string;
    rc_image_back: string;
    rc_image_front: string;
    rc_number: string;
    rc_valid_till: string;
  };
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

  const [pax, setPax] = useState(1);
  const [luggage, setLuggage] = useState(0);
  const [loading, setLoading] = useState(false);

  const cityStations: Record<string, string[]> = {
    Delhi: [
      "Indira Gandhi International Airport (DEL)",
      "New Delhi Railway Station (NDLS)",
      "Old Delhi Railway Station (DLI)",
      "Hazrat Nizamuddin Railway Station (NZM)",
      "Anand Vihar Terminal (ANVT)",
    ],
    Agra: [
      "Agra Cantt Railway Station (AGC)",
      "Agra Fort Railway Station (AF)",
      "Raja Ki Mandi Railway Station (RKM)",
      "Pandit Deen Dayal Upadhyaya Airport (AGR)",
    ],
    Jaipur: [
      "Jaipur Junction (JP)",
      "Gandhi Nagar Railway Station (GADJ)",
      "Jaipur International Airport (JAI)",
    ],
    Chandigarh: [
      "Chandigarh Railway Station (CDG)",
      "Chandigarh International Airport (IXC)",
    ],
    Lucknow: [
      "Charbagh Railway Station (LKO)",
      "Lucknow Junction (LJN)",
      "Chaudhary Charan Singh Airport (LKO)",
    ],
    Dehradun: ["Dehradun Railway Station (DDN)", "Jolly Grant Airport (DED)"],
    Amritsar: [
      "Amritsar Junction (ASR)",
      "Sri Guru Ram Dass Jee International Airport (ATQ)",
    ],
  };

  const allCities = Object.keys(cityStations);

  const handleSearch = async () => {
    if (!pickupLocation) {
      alert("Please select a pickup location");
      return;
    }
    if (!dropCity) {
      alert("Please select a drop city");
      return;
    }

    setLoading(true);
    try {
      const pickup_datetime = new Date(`${pickupDate}T${pickupTime}`);

      const dropoff_datetime = new Date(pickup_datetime);
      dropoff_datetime.setHours(dropoff_datetime.getHours() + 12); // or 24

      const data = await searchCars({
        city: pickupCity,
        pickup_datetime: pickup_datetime.toISOString(),
        dropoff_datetime: dropoff_datetime.toISOString(),
      });

      setCars(data.cars || []);
    } catch (error) {
      console.error("Error searching cars:", error);
      alert("Failed to search cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SAME LOGIC AS searchedCars.tsx
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // City filter - allows cars without city property
      if (
        pickupCity &&
        car.city &&
        car.city.toLowerCase() !== pickupCity.toLowerCase()
      )
        return false;

      // Date availability check
      const pickup = new Date(`${pickupDate}T${pickupTime}`);

      if (car.availableFrom && car.availableTo) {
        const from = new Date(car.availableFrom);
        const to = new Date(car.availableTo);
        if (pickup < from || pickup > to) return false;
      }

      // Check alternative property names
      if (car.available_from && car.available_till) {
        const from = new Date(car.available_from);
        const to = new Date(car.available_till);
        if (pickup < from || pickup > to) return false;
      }

      return true;
    });
  }, [cars, pickupCity, pickupDate, pickupTime]);

  const availableDropCities = allCities.filter((city) => city !== pickupCity);

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
              setDropCity("");
            }}
          >
            {allCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

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
            {cityStations[pickupCity]?.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </label>

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
            {availableDropCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        {/* PAX (+ -) */}
        <label>
          Passengers (PAX):
          <div className="searched-counter">
            <button
              type="button"
              onClick={() => setPax((prev) => Math.max(1, prev - 1))}
            >
              −
            </button>
            <span>{pax}</span>
            <button
              type="button"
              onClick={() => setPax((prev) => Math.min(6, prev + 1))}
            >
              +
            </button>
          </div>
        </label>

        {/* LUGGAGE (+ -) */}
        <label>
          Luggage:
          <div className="searched-counter">
            <button
              type="button"
              onClick={() => setLuggage((prev) => Math.max(0, prev - 1))}
            >
              −
            </button>
            <span>{luggage}</span>
            <button
              type="button"
              onClick={() => setLuggage((prev) => Math.min(5, prev + 1))}
            >
              +
            </button>
          </div>
        </label>

        <label className="searched-switch-label">
          Insure Trip:
          <span className="searched-switch">
            <input type="checkbox" checked readOnly />
            <span className="searched-slider"></span>
          </span>
        </label>

        <button
          className="searched-search-btn"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
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
        {loading ? (
          <p className="searched-no-cars">Searching for cars...</p>
        ) : filteredCars.length === 0 ? (
          <p className="searched-no-cars">
            No cars available. Click Search to find cars.
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
                          pax,
                          luggage,
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
    </>
  );
}
