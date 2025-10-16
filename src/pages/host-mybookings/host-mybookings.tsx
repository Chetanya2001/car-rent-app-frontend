import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getHostBookings } from "../../services/booking";
import "./host-mybookings.css";

type HostBooking = {
  id: number;
  start_datetime: string;
  end_datetime: string;
  pickup_address: string;
  drop_address: string;
  insure_amount: number;
  driver_amount: number;
  status: string;
  Car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_hour: string;
    description: string;
    photos?: { photo_url: string }[];
  };
  guest: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

export default function HostMyBookings() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!token) return;
        const data = await getHostBookings(token);
        setBookings(data);
      } catch (err) {
        console.error("Error loading host bookings", err);
      }
    };
    fetchBookings();
  }, [token]);

  const handleViewCar = (carId: number) => {
    navigate(`/car-details/${carId}`);
  };

  if (bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="no-bookings-container">
          <p className="no-bookings-text">No bookings for your cars yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bookings-container">
        <h2 className="bookings-title">Bookings for Your Cars</h2>

        {bookings.map((booking) => {
          const car = booking.Car;
          const image = car?.photos?.[0]?.photo_url || "/default-car.png";
          const guest = booking.guest;

          const startDate = new Date(booking.start_datetime);
          const endDate = new Date(booking.end_datetime);

          const pickupDate = startDate.toLocaleDateString();
          const pickupTime = startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const dropoffDate = endDate.toLocaleDateString();
          const dropoffTime = endDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={booking.id} className="booking-card">
              <img
                src={image}
                alt={`${car.make} ${car.model}`}
                className="booking-image"
              />

              <div className="booking-details">
                <div>
                  <h3>
                    {car.make} {car.model} ({car.year})
                  </h3>
                  <p className="car-description">{car.description}</p>

                  <div className="booking-dates">
                    <div>
                      <p className="label">Pickup</p>
                      <p>
                        {booking.pickup_address}
                        <br />
                        {pickupDate}, {pickupTime}
                      </p>
                    </div>
                    <div>
                      <p className="label">Drop-off</p>
                      <p>
                        {booking.drop_address}
                        <br />
                        {dropoffDate}, {dropoffTime}
                      </p>
                    </div>
                  </div>

                  <div className="guest-info">
                    <p className="label">Guest:</p>
                    <p>
                      {guest
                        ? `${guest.first_name} ${guest.last_name} (${guest.email})`
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="price-section">
                  <h4>₹{car.price_per_hour}/hr</h4>
                  <p>
                    Status: <strong>{booking.status}</strong>
                  </p>
                  <p>
                    Insure: ₹{booking.insure_amount} <br />
                    Driver: ₹{booking.driver_amount}
                  </p>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewCar(car.id)}
                  >
                    View Car
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
