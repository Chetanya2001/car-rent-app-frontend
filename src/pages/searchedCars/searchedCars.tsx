import { useLocation } from "react-router-dom";
import "./searchedCars.css";
import Navbar from "../../components/Navbar/Navbar"; // make sure you have a Navbar component

// Interface according to API
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  photos: string[]; // array of image URLs
}

export default function SearchedCars() {
  const location = useLocation();
  const cars: Car[] = location.state?.cars || [];

  return (
    <>
      <Navbar /> {/* Navbar on top */}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
