import { useLocation, useNavigate } from "react-router-dom";
import "./searchedCars.css";
import Navbar from "../../components/Navbar/Navbar";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  photos: string[];
}

export default function SearchedCars() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Extract data properly
  const cars: Car[] = location.state?.cars || [];
  const bookingDetails = location.state?.bookingDetails || {};

  console.log("🚗 Cars received:", cars);
  console.log("📅 Booking Details received:", bookingDetails);

  return (
    <>
      <Navbar />
      <div className="searched-cars-page">
        {cars.length === 0 ? (
          <p className="no-cars">No cars found for the selected dates.</p>
        ) : (
          <div className="car-list">
            {cars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-image-wrapper">
                  {car.photos && car.photos.length > 0 ? (
                    <img
                      src={car.photos[0]}
                      alt={`${car.make} ${car.model}`}
                      className="car-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="car-placeholder">No Image</div>
                  )}
                </div>
                <div className="car-info">
                  <h3>
                    {car.make} {car.model}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p className="car-price">₹{car.price_per_hour} / hour</p>
                </div>

                {/* ✅ Action buttons */}
                <div className="car-actions">
                  <button className="btn-book">Book now</button>
                  <button
                    className="btn-details"
                    onClick={() =>
                      navigate(`/car-details/${car.id}`, {
                        state: {
                          pickup_datetime:
                            bookingDetails.pickupDate +
                            "T" +
                            bookingDetails.pickupTime,
                          dropoff_datetime:
                            bookingDetails.dropDate +
                            "T" +
                            bookingDetails.dropTime,
                          insurance: bookingDetails.insureTrip,
                          driver: bookingDetails.driverRequired,
                          differentDrop: bookingDetails.differentDrop,
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
