import { useEffect, useState } from "react";
import { getHostCars } from "../../services/carService";
import type { Car } from "../../types/Cars";
import Navbar from "../../components/Navbar/Navbar";
import "./myCars.css";

export default function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getHostCars(); // data = { cars: [...] }

        if (!Array.isArray(data.cars)) {
          console.error("Invalid response from backend:", data);
          setCars([]);
        } else {
          setCars(data.cars);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  return (
    <>
      <Navbar />
      <div className="my-cars-page">
        <h2>My Listed Cars</h2>
        <div className="cars-grid">
          {cars.length === 0 && <p>No cars found.</p>}

          {cars.map((car) => {
            const mainImage =
              car.photos?.[0] || car.documents?.rc_image_front || "";

            return (
              <div key={car.id} className="car-card">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={`${car.make} ${car.model}`}
                    className="car-img"
                  />
                ) : (
                  <div className="car-img placeholder">No Image</div>
                )}

                <div className="car-info">
                  <h3>
                    {car.make} {car.model}
                  </h3>
                  <p>Year: {car.year}</p>
                  <p>
                    Price:{" "}
                    {car.price_per_hour
                      ? `₹${car.price_per_hour}/hr`
                      : "Not set"}
                  </p>
                  {car.available_from && car.available_till && (
                    <p>
                      Available:{" "}
                      {new Date(car.available_from).toLocaleDateString()} -{" "}
                      {new Date(car.available_till).toLocaleDateString()}
                    </p>
                  )}
                  <p>RC Number: {car.documents?.rc_number}</p>
                  <p>Owner: {car.documents?.owner_name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
