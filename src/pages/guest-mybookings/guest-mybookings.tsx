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
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
};

export default function GuestMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);
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

  const handleViewDetails = (carId: number) => {
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
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleChatClick = (host: Booking["Car"]["host"]) => {
    // TODO: Implement chat functionality
    if (host) {
      alert(
        `Chat feature coming soon! Host: ${host.first_name} ${host.last_name}`
      );
      // navigate(`/chat/${host.id}`);
    }
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
          const image = car?.photos?.[0]?.photo_url || "/default-car.png";
          const host = car?.host;

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
                      {host ? `${host.first_name} ${host.last_name}` : "N/A"}
                    </p>

                    {/* Contact Icons */}
                    {host && (
                      <div className="contact-icons">
                        <button
                          className="contact-icon-btn phone-btn"
                          onClick={() =>
                            handlePhoneClick(host.phone, booking.id)
                          }
                          title={`Call ${host.phone}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <span>
                            {copiedPhone === booking.id ? "Copied!" : "Call"}
                          </span>
                        </button>
                        <button
                          className="contact-icon-btn chat-btn"
                          onClick={() => handleChatClick(host)}
                          title="Chat with host"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>Chat</span>
                        </button>

                        <button
                          className="contact-icon-btn email-btn"
                          onClick={() => handleEmailClick(host.email)}
                          title={`Email ${host.email}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          <span>Email</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="price-section">
                  {/* Calculation Breakdown */}
                  {(() => {
                    const hourlyRate =
                      parseFloat(car.price_per_hour.replace(/[^\d.]/g, "")) ||
                      0;
                    const totalHours = Math.round(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60)
                    );
                    const rentalAmount = hourlyRate * totalHours;

                    return (
                      <>
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
                            <span>
                              Insure: ₹{booking.insure_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="amount-row">
                            <span>
                              Driver: ₹{booking.driver_amount.toLocaleString()}
                            </span>
                          </div>
                          <hr />
                          <div className="total-row">
                            <strong>
                              Total: ₹
                              {(
                                rentalAmount +
                                booking.insure_amount +
                                booking.driver_amount
                              ).toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        <p className="status-row">
                          Status: <strong>{booking.status}</strong>
                        </p>

                        <button
                          className="view-details-btn"
                          onClick={() => handleViewDetails(car.id)}
                        >
                          View Details
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
