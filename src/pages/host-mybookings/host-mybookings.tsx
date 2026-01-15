import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getHostBookings } from "../../services/booking";
import "./host-mybookings.css";

type HostBooking = {
  id: number;
  status: string;
  total_amount: number;
  booking_type: string;
  Car: {
    id: number;
    make: string;
    model: string;
    year: number;
    price_per_hour: string | null;
    price_per_km: string | null;
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
  IntercityBooking: {
    pickup_address: string;
    drop_address: string;
    pickup_lat: string;
    pickup_long: string;
    drop_lat: string;
    drop_long: string;
    pax: number;
    luggage: number;
    distance_km: string;
    driver_amount: number;
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

  const handleChatClick = (guest: HostBooking["guest"]) => {
    alert(
      `Chat feature coming soon! Guest: ${guest.first_name} ${guest.last_name}`
    );
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
          const ic = booking.IntercityBooking;

          // Skip if neither booking type exists
          if (!sd && !ic) return null;

          const image = car?.photos?.[0]?.photo_url || "/default-car.png";

          // ===== SELF DRIVE BOOKING =====
          if (sd) {
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

            const hourlyRate =
              parseFloat(
                car.price_per_hour?.toString().replace(/[^\d.]/g, "") || "0"
              ) || 0;

            const totalHours = Math.max(
              1,
              Math.round(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
              )
            );

            const rentalAmount = hourlyRate * totalHours;
            const insureAmount = sd.insure_amount || 0;
            const totalAmount = rentalAmount + insureAmount;

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

                    <div className="guest-info">
                      <p className="label">Guest</p>
                      <p>
                        {guest
                          ? `${guest.first_name} ${guest.last_name}`
                          : "N/A"}
                      </p>

                      {guest && (
                        <div className="contact-icons">
                          <button
                            className="contact-icon-btn phone-btn"
                            onClick={() =>
                              handlePhoneClick(guest.phone, booking.id)
                            }
                            title={`Call ${guest.phone}`}
                          >
                            📞 <span>Call</span>
                          </button>
                          {copiedPhone === booking.id && (
                            <span className="copied-feedback">
                              Phone copied!
                            </span>
                          )}

                          <button
                            className="contact-icon-btn chat-btn"
                            onClick={() => handleChatClick(guest)}
                          >
                            💬 <span>Chat</span>
                          </button>

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
          }

          // ===== INTERCITY BOOKING =====
          if (ic) {
            const perKmRate =
              parseFloat(
                car.price_per_km?.toString().replace(/[^\d.]/g, "") || "0"
              ) || 0;
            const distanceKm = parseFloat(ic.distance_km || "0");
            const driverAmount = ic.driver_amount || 0;

            const rentalAmount = perKmRate * distanceKm;
            const totalAmount = rentalAmount + driverAmount;

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
                        <p>{ic.pickup_address}</p>
                      </div>

                      <div>
                        <p className="label">Drop-off</p>
                        <p>{ic.drop_address}</p>
                      </div>
                    </div>

                    <div className="booking-dates">
                      <div>
                        <p className="label">Passengers</p>
                        <p>{ic.pax}</p>
                      </div>

                      <div>
                        <p className="label">Luggage</p>
                        <p>{ic.luggage}</p>
                      </div>

                      <div>
                        <p className="label">Distance</p>
                        <p>{distanceKm.toFixed(2)} km</p>
                      </div>
                    </div>

                    <div className="guest-info">
                      <p className="label">Guest</p>
                      <p>
                        {guest
                          ? `${guest.first_name} ${guest.last_name}`
                          : "N/A"}
                      </p>

                      {guest && (
                        <div className="contact-icons">
                          <button
                            className="contact-icon-btn phone-btn"
                            onClick={() =>
                              handlePhoneClick(guest.phone, booking.id)
                            }
                            title={`Call ${guest.phone}`}
                          >
                            📞 <span>Call</span>
                          </button>
                          {copiedPhone === booking.id && (
                            <span className="copied-feedback">
                              Phone copied!
                            </span>
                          )}

                          <button
                            className="contact-icon-btn chat-btn"
                            onClick={() => handleChatClick(guest)}
                          >
                            💬 <span>Chat</span>
                          </button>

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

                  <div className="price-section">
                    <div className="calculation-breakdown">
                      <div className="calc-row">
                        <span>₹{perKmRate}/km</span>
                        <span>× {distanceKm.toFixed(2)} km</span>
                      </div>
                      <div className="calc-equals">
                        <strong>= ₹{rentalAmount.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="total-breakdown">
                      <div className="amount-row">
                        <span>Driver: ₹{driverAmount.toLocaleString()}</span>
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
          }

          return null;
        })}
      </div>
    </>
  );
}
