import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getGuestBookings } from "../../services/booking";
import "./guest-mybooking.css";

type Booking = {
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
    host?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
};

export default function GuestMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!token) return;
        const data = await getGuestBookings(token);
        setBookings(data);
      } catch (err) {
        console.error("Error loading bookings", err);
      }
    };
    fetchBookings();
  }, [token]);

  const handleBookNow = () => navigate("/cars");

  if (bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="no-bookings-container">
          <p className="no-bookings-text">You have no bookings yet.</p>
          <button className="book-now-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bookings-container">
        <h2 className="bookings-title">My Bookings</h2>

        {bookings.map((booking) => {
          const car = booking.Car;
          const image = car?.photos?.[0]?.photo_url || "/default-car.png"; // first photo
          const host = car?.host;
          const pickupDate = new Date(
            booking.start_datetime
          ).toLocaleDateString();
          const pickupTime = new Date(
            booking.start_datetime
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const dropoffDate = new Date(
            booking.end_datetime
          ).toLocaleDateString();
          const dropoffTime = new Date(booking.end_datetime).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          );

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
                        {booking.pickup_address} <br />
                        {pickupDate}, {pickupTime}
                      </p>
                    </div>
                    <div>
                      <p className="label">Drop-off</p>
                      <p>
                        {booking.drop_address} <br />
                        {dropoffDate}, {dropoffTime}
                      </p>
                    </div>
                  </div>

                  <div className="host-info">
                    <p className="label">Host:</p>
                    <p>
                      {host
                        ? `${host.first_name} ${host.last_name} (${host.email})`
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
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
