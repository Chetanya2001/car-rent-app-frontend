import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getHostBookings } from "../../services/booking";
import "./host-mybookings.css";

type HostBooking = {
  id: number;
  status: string;
  total_amount: number;
  Car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_hour: string;
    description: string;
    photos?: { photo_url: string }[];
  };
  SelfDriveBooking: {
    start_datetime: string;
    end_datetime: string;
    pickup_address: string;
    drop_address: string;
    insure_amount: number;
  } | null;
  guest: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
};

export default function HostMyBookings() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);
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

  const handlePhoneClick = async (phone: string, bookingId: number) => {
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(phone);

      // Show copied feedback
      setCopiedPhone(bookingId);
      setTimeout(() => setCopiedPhone(null), 2000);

      // Open phone dialer
      window.location.href = `tel:${phone}`;
    } catch (err) {
      console.error("Failed to copy phone number", err);
      // Fallback: still open dialer even if copy fails
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleChatClick = (guest: HostBooking["guest"]) => {
    // TODO: Implement chat functionality
    // For now, we can show an alert or navigate to a chat page
    alert(
      `Chat feature coming soon! Guest: ${guest.first_name} ${guest.last_name}`
    );
    // navigate(`/chat/${guest.id}`);
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
          const guest = booking.guest;
          const sd = booking.SelfDriveBooking;

          // 👉 Only show SELF_DRIVE bookings here
          if (!sd) return null;

          const image = car?.photos?.[0]?.photo_url || "/default-car.png";

          // ✅ Dates MUST come from SelfDriveBooking
          const startDate = new Date(sd.start_datetime);
          const endDate = new Date(sd.end_datetime);

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

          // ✅ Price calculation (same as before)
          const hourlyRate =
            parseFloat(car.price_per_hour?.toString().replace(/[^\d.]/g, "")) ||
            0;

          const totalHours = Math.max(
            1,
            Math.round(
              (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
            )
          );

          const rentalAmount = hourlyRate * totalHours;
          const insureAmount = sd.insure_amount || 0;
          const driverAmount = 0; // self-drive
          const totalAmount = rentalAmount + insureAmount + driverAmount;

          return (
            <div key={booking.id} className="booking-card">
              {/* ================= CAR IMAGE ================= */}
              <img
                src={image}
                alt={`${car.make} ${car.model}`}
                className="booking-image"
              />

              <div className="booking-details">
                {/* ================= LEFT ================= */}
                <div>
                  <h3>
                    {car.make} {car.model} ({car.year})
                  </h3>
                  <p className="car-description">{car.description}</p>

                  {/* ================= DATES ================= */}
                  <div className="booking-dates">
                    <div>
                      <p className="label">Pickup</p>
                      <p>
                        {sd.pickup_address}
                        <br />
                        {pickupDate}, {pickupTime}
                      </p>
                    </div>

                    <div>
                      <p className="label">Drop-off</p>
                      <p>
                        {sd.drop_address}
                        <br />
                        {dropoffDate}, {dropoffTime}
                      </p>
                    </div>
                  </div>

                  {/* ================= GUEST INFO ================= */}
                  <div className="guest-info">
                    <p className="label">Guest</p>
                    <p>
                      {guest ? `${guest.first_name} ${guest.last_name}` : "N/A"}
                    </p>

                    {/* ===== CALL / CHAT / EMAIL ===== */}
                    {guest && (
                      <div className="contact-icons">
                        {/* 📞 CALL */}
                        <button
                          className="contact-icon-btn phone-btn"
                          onClick={() =>
                            handlePhoneClick(guest.phone, booking.id)
                          }
                          title={`Call ${guest.phone}`}
                        >
                          📞 <span>Call</span>
                        </button>
                        {copiedPhone && (
                          <span className="copied-feedback">Phone copied!</span>
                        )}

                        {/* 💬 CHAT */}
                        <button
                          className="contact-icon-btn chat-btn"
                          onClick={() => handleChatClick(guest)}
                        >
                          💬 <span>Chat</span>
                        </button>

                        {/* ✉️ EMAIL */}
                        <button
                          className="contact-icon-btn email-btn"
                          onClick={() => handleEmailClick(guest.email)}
                        >
                          ✉️ <span>Email</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= RIGHT / PRICE ================= */}
                <div className="price-section">
                  <div className="calculation-breakdown">
                    <div className="calc-row">
                      <span>₹{hourlyRate}/hr</span>
                      <span>× {totalHours} hr</span>
                    </div>
                    <div className="calc-equals">
                      <strong>= ₹{rentalAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="total-breakdown">
                    <div className="amount-row">
                      <span>Insurance: ₹{insureAmount.toLocaleString()}</span>
                    </div>

                    <hr />

                    <div className="total-row">
                      <strong>Total: ₹{totalAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  <p className="status-row">
                    Status: <strong>{booking.status}</strong>
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
