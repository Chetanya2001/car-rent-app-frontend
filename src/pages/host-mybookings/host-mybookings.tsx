import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getHostBookings } from "../../services/booking";
import "./host-mybookings.css";

type HostBooking = {
  id: number;
  status: string;
  total_amount: number;
  paid_amount: number;
  payment_status: string;
  booking_type: string;
  createdAt: string;
  updatedAt: string;
  Car: {
    id: number;
    year: number;
    description: string;
    photos?: { id: number; photo_url: string }[];
    make: {
      name: string;
    };
    model: {
      name: string;
    };
  };
  SelfDriveBooking: {
    start_datetime: string;
    end_datetime: string;
    pickup_address: string;
    drop_address: string;
    base_amount: number;
    insure_amount: number;
    driver_amount: number;
    drop_charge: number;
    gst_amount: number;
    total_amount: number;
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
    base_amount: number;
    gst_amount: number;
    total_amount: number;
  } | null;
  guest: {
    id: number;
    first_name: string;
    last_name: string;
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

  const handleChatClick = (guest: HostBooking["guest"]) => {
    alert(
      `Chat feature coming soon! Guest: ${guest.first_name} ${guest.last_name}`,
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "status-active";
      case "CONFIRMED":
        return "status-confirmed";
      case "COMPLETED":
        return "status-completed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  if (bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="host-mybookings-container">
          <div className="empty-state">
            <h2>No bookings for your cars yet.</h2>
            <p>Your bookings will appear here once guests make reservations.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="host-mybookings-container">
        <div className="page-header">
          <h1>Bookings for Your Cars</h1>
          <p className="subtitle">Manage your vehicle reservations</p>
        </div>

        <div className="bookings-grid">
          {bookings.map((booking) => {
            const car = booking.Car;
            const guest = booking.guest;
            const sd = booking.SelfDriveBooking;
            const ic = booking.IntercityBooking;

            // Skip if neither booking type exists
            if (!sd && !ic) return null;

            const image = car?.photos?.[0]?.photo_url || "/default-car.png";
            const bookingDate = new Date(
              booking.createdAt,
            ).toLocaleDateString();

            // ===== SELF DRIVE BOOKING =====
            if (sd) {
              const startDate = new Date(sd.start_datetime);
              const endDate = new Date(sd.end_datetime);

              const pickupDate = startDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const pickupTime = startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const dropoffDate = endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const dropoffTime = endDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const totalHours = Math.max(
                1,
                Math.round(
                  (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
                ),
              );

              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-id-section">
                      <span className="booking-label">Booking ID</span>
                      <span className="booking-id">#{booking.id}</span>
                    </div>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="car-info-section">
                    <img
                      src={image}
                      alt={`${car.make.name} ${car.model.name}`}
                      className="car-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-car.png";
                      }}
                    />
                    <div className="car-details">
                      <h3 className="car-title">
                        {car.make.name} {car.model.name}
                      </h3>
                      <p className="car-year">{car.year}</p>
                      <p className="car-description">{car.description}</p>
                      <span className="booking-type-badge">Self Drive</span>
                    </div>
                  </div>

                  <div className="booking-details-section">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <span className="detail-label">Pickup</span>
                          <span className="detail-value">
                            {sd.pickup_address}
                          </span>
                          <span className="detail-time">
                            {pickupDate} at {pickupTime}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">🏁</span>
                        <div className="detail-content">
                          <span className="detail-label">Drop-off</span>
                          <span className="detail-value">
                            {sd.drop_address}
                          </span>
                          <span className="detail-time">
                            {dropoffDate} at {dropoffTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="duration-info">
                      <span className="duration-icon">⏱️</span>
                      <span className="duration-text">
                        Duration: {totalHours} hours
                      </span>
                    </div>
                  </div>

                  <div className="guest-info-section">
                    <div className="guest-header">
                      <span className="guest-icon">👤</span>
                      <div className="guest-details">
                        <span className="guest-name">
                          {guest.first_name} {guest.last_name}
                        </span>
                        <span className="guest-phone">{guest.phone}</span>
                      </div>
                    </div>
                    <div className="guest-actions">
                      <button
                        className="action-btn call-btn"
                        onClick={() =>
                          handlePhoneClick(guest.phone, booking.id)
                        }
                        title={`Call ${guest.phone}`}
                      >
                        📞 Call
                      </button>
                      {copiedPhone === booking.id && (
                        <span className="copied-toast">Phone copied!</span>
                      )}
                      <button
                        className="action-btn chat-btn"
                        onClick={() => handleChatClick(guest)}
                      >
                        💬 Chat
                      </button>
                    </div>
                  </div>

                  <div className="pricing-section">
                    <h4 className="pricing-title">Price Breakdown</h4>
                    <div className="price-details">
                      <div className="price-row">
                        <span className="price-label">Base Amount</span>
                        <span className="price-value">
                          ₹{sd.base_amount.toLocaleString()}
                        </span>
                      </div>
                      {sd.insure_amount > 0 && (
                        <div className="price-row">
                          <span className="price-label">Insurance</span>
                          <span className="price-value">
                            ₹{sd.insure_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {sd.driver_amount > 0 && (
                        <div className="price-row">
                          <span className="price-label">Driver Charges</span>
                          <span className="price-value">
                            ₹{sd.driver_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {sd.drop_charge > 0 && (
                        <div className="price-row">
                          <span className="price-label">Drop Charges</span>
                          <span className="price-value">
                            ₹{sd.drop_charge.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {sd.gst_amount > 0 && (
                        <div className="price-row">
                          <span className="price-label">GST (18%)</span>
                          <span className="price-value">
                            ₹{sd.gst_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="price-row total-row">
                        <span className="price-label">Total Amount</span>
                        <span className="price-value total-price">
                          ₹{sd.total_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="payment-status">
                        <span className="payment-label">Payment Status:</span>
                        <span
                          className={`payment-badge ${booking.payment_status.toLowerCase()}`}
                        >
                          {booking.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <span className="booking-date">
                      Booked on {bookingDate}
                    </span>
                    <button
                      className="view-car-btn"
                      onClick={() => handleViewCar(car.id)}
                    >
                      View Car Details
                    </button>
                  </div>
                </div>
              );
            }

            // ===== INTERCITY BOOKING =====
            if (ic) {
              const distanceKm = parseFloat(ic.distance_km || "0");

              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-id-section">
                      <span className="booking-label">Booking ID</span>
                      <span className="booking-id">#{booking.id}</span>
                    </div>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="car-info-section">
                    <img
                      src={image}
                      alt={`${car.make.name} ${car.model.name}`}
                      className="car-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-car.png";
                      }}
                    />
                    <div className="car-details">
                      <h3 className="car-title">
                        {car.make.name} {car.model.name}
                      </h3>
                      <p className="car-year">{car.year}</p>
                      <p className="car-description">{car.description}</p>
                      <span className="booking-type-badge intercity">
                        Intercity
                      </span>
                    </div>
                  </div>

                  <div className="booking-details-section">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <div className="detail-content">
                          <span className="detail-label">Pickup</span>
                          <span className="detail-value">
                            {ic.pickup_address}
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">🏁</span>
                        <div className="detail-content">
                          <span className="detail-label">Drop-off</span>
                          <span className="detail-value">
                            {ic.drop_address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="trip-info-grid">
                      <div className="trip-info-item">
                        <span className="info-icon">🚗</span>
                        <div className="info-content">
                          <span className="info-label">Distance</span>
                          <span className="info-value">
                            {distanceKm.toFixed(2)} km
                          </span>
                        </div>
                      </div>
                      <div className="trip-info-item">
                        <span className="info-icon">👥</span>
                        <div className="info-content">
                          <span className="info-label">Passengers</span>
                          <span className="info-value">{ic.pax}</span>
                        </div>
                      </div>
                      <div className="trip-info-item">
                        <span className="info-icon">🧳</span>
                        <div className="info-content">
                          <span className="info-label">Luggage</span>
                          <span className="info-value">{ic.luggage}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="guest-info-section">
                    <div className="guest-header">
                      <span className="guest-icon">👤</span>
                      <div className="guest-details">
                        <span className="guest-name">
                          {guest.first_name} {guest.last_name}
                        </span>
                        <span className="guest-phone">{guest.phone}</span>
                      </div>
                    </div>
                    <div className="guest-actions">
                      <button
                        className="action-btn call-btn"
                        onClick={() =>
                          handlePhoneClick(guest.phone, booking.id)
                        }
                        title={`Call ${guest.phone}`}
                      >
                        📞 Call
                      </button>
                      {copiedPhone === booking.id && (
                        <span className="copied-toast">Phone copied!</span>
                      )}
                      <button
                        className="action-btn chat-btn"
                        onClick={() => handleChatClick(guest)}
                      >
                        💬 Chat
                      </button>
                    </div>
                  </div>

                  <div className="pricing-section">
                    <h4 className="pricing-title">Price Breakdown</h4>
                    <div className="price-details">
                      <div className="price-row">
                        <span className="price-label">Base Amount</span>
                        <span className="price-value">
                          ₹{ic.base_amount.toLocaleString()}
                        </span>
                      </div>
                      {ic.driver_amount > 0 && (
                        <div className="price-row">
                          <span className="price-label">Driver Charges</span>
                          <span className="price-value">
                            ₹{ic.driver_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {ic.gst_amount > 0 && (
                        <div className="price-row">
                          <span className="price-label">GST (18%)</span>
                          <span className="price-value">
                            ₹{ic.gst_amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="price-row total-row">
                        <span className="price-label">Total Amount</span>
                        <span className="price-value total-price">
                          ₹{ic.total_amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="payment-status">
                        <span className="payment-label">Payment Status:</span>
                        <span
                          className={`payment-badge ${booking.payment_status.toLowerCase()}`}
                        >
                          {booking.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <span className="booking-date">
                      Booked on {bookingDate}
                    </span>
                    <button
                      className="view-car-btn"
                      onClick={() => handleViewCar(car.id)}
                    >
                      View Car Details
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
}
