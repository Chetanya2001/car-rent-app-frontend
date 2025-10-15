import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import { getGuestBookings } from "../../services/booking"; // import your service
import "./guest-mybooking.css";

type Booking = {
  id: number;
  carName: string;
  carType: string;
  image: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  price: number;
};

export default function GuestMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const navigate = useNavigate();

  // JWT token from localStorage or auth context
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!token) return;
        const data = await getGuestBookings(token);
        const mappedBookings = data.map((b: any) => ({
          id: b.id,
          carName: b.Car?.name || "Unknown Car",
          carType: b.Car?.type || "Unknown Type",
          image: b.Car?.image || "/default-car.png",
          pickupDate: new Date(b.start_datetime).toLocaleDateString(),
          pickupTime: new Date(b.start_datetime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          dropoffDate: new Date(b.end_datetime).toLocaleDateString(),
          dropoffTime: new Date(b.end_datetime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: b.price || 0, // Replace if your API returns price in other field
        }));
        setBookings(mappedBookings);
      } catch (err) {
        console.error("Error loading bookings", err);
      }
    };
    fetchBookings();
  }, [token]);

  const handleBookNow = () => {
    navigate("/cars");
  };

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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bookings-container">
        <h2 className="bookings-title">My Bookings</h2>
        {bookings.map((booking: Booking) => (
          <div key={booking.id} className="booking-card">
            <img
              src={booking.image}
              alt={booking.carName}
              className="booking-image"
            />
            <div className="booking-details">
              <div>
                <h3>{booking.carName}</h3>
                <p className="car-type">{booking.carType}</p>
                <div className="booking-dates">
                  <div>
                    <p className="label">Pickup</p>
                    <p>
                      {booking.pickupDate}, {booking.pickupTime}
                    </p>
                  </div>
                  <div>
                    <p className="label">Drop-off</p>
                    <p>
                      {booking.dropoffDate}, {booking.dropoffTime}
                    </p>
                  </div>
                </div>
              </div>
              <div className="price-section">
                <h4>₹{booking.price}</h4>
                <p>Total price</p>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
