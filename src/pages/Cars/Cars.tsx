import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Car } from "../../types/Cars";
import Navbar from "../../components/Navbar/Navbar";
import { getCars } from "../../services/carService";

const Cars: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        console.log("📦 Cars in state:", data); // 👈 log here too
        setCars(data);
      } catch (error) {
        console.error("❌ Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Available Cars</h2>
        <div className="row">
          {cars.map((car) => (
            <div key={car.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <img
                  src={car.image ?? ""}
                  className="card-img-top"
                  alt={car.name}
                  onError={(_e) => {
                    console.error("🖼️ Image not loading:", car.image);
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{car.name}</h5>
                  <p className="card-text text-muted">
                    {car.brand}, {car.year}
                  </p>
                  <p className="fw-bold text-primary">
                    INR {car.price_per_hour} <small>/hour</small>
                  </p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button className="btn btn-primary">Book now</button>
                    <button className="btn btn-success">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cars;
