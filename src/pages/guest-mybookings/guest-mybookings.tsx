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
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(bookingId);
      setTimeout(() => setCopiedPhone(null), 2000);
      window.location.href = `tel:${phone}`;
    } catch (err) {
      console.error("Failed to copy phone number", err);
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleChatClick = (host: Booking["Car"]["host"] | null | undefined) => {
    if (host) {
      alert(`Chat feature coming soon!`);
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
          const isCarAvailable = Boolean(car);
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
                alt={
                  isCarAvailable ? `${car!.make} ${car!.model}` : "Car removed"
                }
                className="booking-image"
              />

              <div className="booking-details">
                <div>
                  <h3>
                    {isCarAvailable
                      ? `${car!.make} ${car!.model} (${car!.year})`
                      : "Car no longer available"}
                  </h3>

                  {isCarAvailable && (
                    <p className="car-description">{car!.description}</p>
                  )}

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

                    {host && (
                      <div className="contact-icons">
                        <button
                          className="contact-icon-btn phone-btn"
                          onClick={() =>
                            handlePhoneClick(host.phone, booking.id)
                          }
                        >
                          <span>
                            {copiedPhone === booking.id ? "Copied!" : "Call"}
                          </span>
                        </button>

                        <button
                          className="contact-icon-btn chat-btn"
                          onClick={() => handleChatClick(host)}
                        >
                          <span>Chat</span>
                        </button>

                        <button
                          className="contact-icon-btn email-btn"
                          onClick={() => handleEmailClick(host.email)}
                        >
                          <span>Email</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="price-section">
                  {!isCarAvailable ? (
                    <p className="status-row">
                      This car has been removed from inventory.
                    </p>
                  ) : (
                    (() => {
                      const hourlyRate =
                        parseFloat(
                          car!.price_per_hour.replace(/[^\d.]/g, "")
                        ) || 0;

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
                              <strong>
                                = ₹{rentalAmount.toLocaleString()}
                              </strong>
                            </div>
                          </div>

                          <div className="total-breakdown">
                            <div className="amount-row">
                              <span>
                                Insure: ₹
                                {booking.insure_amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="amount-row">
                              <span>
                                Driver: ₹
                                {booking.driver_amount.toLocaleString()}
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
                            disabled={!isCarAvailable}
                            onClick={() =>
                              isCarAvailable && handleViewDetails(car!.id)
                            }
                          >
                            View Details
                          </button>
                        </>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
