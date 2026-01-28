import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getGuestBookings } from "../../services/booking";
import PickupOTP from "../../components/PickupOTP/PickupOTP";
import "./guest-mybooking.css";

type SelfDriveBooking = {
  start_datetime: string;
  end_datetime: string;
  pickup_address: string;
  drop_address: string;
  insure_amount: number;
};

type IntercityBooking = {
  pickup_address: string;
  drop_address: string;
  distance_km: string;
  driver_amount: number;
  pax: number;
  luggage: number;
};

// ✅ FIXED: make/model can be string OR object (handles both API formats)
type CarMake = string | { name: string };
type CarModel = string | { name: string };

type Booking = {
  id: number;
  booking_type: "SELF_DRIVE" | "INTERCITY";
  status: string;
  total_amount: number;
  createdAt: string;
  Car: {
    id: number;
    make: CarMake; // ✅ Flexible: string | {name: string}
    model: CarModel; // ✅ Flexible: string | {name: string}
    year: number;
    price_per_hour: string | null;
    price_per_km: string | null;
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
  SelfDriveBooking: SelfDriveBooking | null;
  IntercityBooking: IntercityBooking | null;
};

// ✅ HELPER: Safely get make/model name (handles string OR object)
const getMakeName = (make: CarMake): string => {
  if (typeof make === "string") return make;
  return make?.name || "Unknown Make";
};

const getModelName = (model: CarModel): string => {
  if (typeof model === "string") return model;
  return model?.name || "Unknown Model";
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
        console.log("✅ Bookings loaded:", data);
        setBookings(data);
      } catch (err) {
        console.error("❌ Error loading bookings", err);
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

          // ✅ SAFE: Using helper functions - NO CRASH
          const makeName = getMakeName(car?.make);
          const modelName = getModelName(car?.model);

          console.log(`🚗 Booking ${booking.id}:`, {
            make: car?.make,
            makeName,
            model: car?.model,
            modelName,
            year: car?.year,
          });

          const isSelfDrive = booking.booking_type === "SELF_DRIVE";
          const isIntercity = booking.booking_type === "INTERCITY";
          const sdb = booking.SelfDriveBooking;
          const icb = booking.IntercityBooking;

          // Self-drive calculations
          let pickupDate = "";
          let pickupTime = "";
          let dropoffDate = "";
          let dropoffTime = "";
          let totalHours = 0;
          let hourlyRate = 0;
          let rentalAmount = 0;

          if (isSelfDrive && sdb) {
            const startDate = new Date(sdb.start_datetime);
            const endDate = new Date(sdb.end_datetime);
            pickupDate = startDate.toLocaleDateString();
            pickupTime = startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            dropoffDate = endDate.toLocaleDateString();
            dropoffTime = endDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            totalHours = Math.max(
              1,
              Math.round(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60),
              ),
            );
            hourlyRate =
              parseFloat((car?.price_per_hour || "0").replace(/[^\d.]/g, "")) ||
              0;
            rentalAmount = hourlyRate * totalHours;
          }

          // Intercity calculations
          let pricePerKm = 0;
          let distanceKm = 0;
          let baseFare = 0;
          if (isIntercity && icb) {
            pricePerKm = parseFloat(car?.price_per_km || "0");
            distanceKm = parseFloat(icb.distance_km);
            baseFare = Math.round(pricePerKm * distanceKm);
          }

          return (
            <div key={booking.id} className="booking-card">
              <img
                src={image}
                alt={`${makeName} ${modelName}`}
                className="booking-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-car.png";
                }}
              />
              <div className="booking-details">
                <div>
                  <h3>
                    {isCarAvailable
                      ? `${makeName} ${modelName} (${car!.year})` // ✅ SAFE: strings only
                      : "Car no longer available"}
                  </h3>
                  {isCarAvailable && (
                    <p className="car-description">{car!.description}</p>
                  )}

                  {/* SELF DRIVE BOOKING */}
                  {isSelfDrive && sdb && (
                    <>
                      <div className="booking-dates">
                        <div>
                          <p className="label">Pickup</p>
                          <p>
                            {sdb.pickup_address}
                            <br />
                            {pickupDate}, {pickupTime}
                          </p>
                        </div>
                        <div>
                          <p className="label">Drop-off</p>
                          <p>
                            {sdb.drop_address}
                            <br />
                            {dropoffDate}, {dropoffTime}
                          </p>
                        </div>
                      </div>

                      {/* ✅ NEW: Pickup OTP Component */}
                      <PickupOTP
                        bookingId={booking.id}
                        pickupDateTime={sdb.start_datetime}
                        bookingStatus={booking.status}
                      />
                    </>
                  )}

                  {/* INTERCITY BOOKING */}
                  {isIntercity && icb && (
                    <div className="booking-dates">
                      <div>
                        <p className="label">Pickup Station</p>
                        <p>{icb.pickup_address}</p>
                      </div>
                      <div>
                        <p className="label">Drop Location</p>
                        <p>{icb.drop_address}</p>
                      </div>
                      <div>
                        <p className="label">Distance</p>
                        <p>{distanceKm} km</p>
                      </div>
                      <div>
                        <p className="label">Passengers</p>
                        <p>
                          PAX: {icb.pax} | Luggage: {icb.luggage}
                        </p>
                      </div>
                    </div>
                  )}

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
                  {/* SELF DRIVE PRICING */}
                  {isSelfDrive && sdb && (
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
                            Insure: ₹{sdb.insure_amount.toLocaleString()}
                          </span>
                        </div>
                        <hr />
                        <div className="total-row">
                          <strong>
                            Total: ₹{booking.total_amount.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </>
                  )}

                  {/* INTERCITY PRICING */}
                  {isIntercity && icb && (
                    <>
                      <div className="calculation-breakdown">
                        <div className="calc-row">
                          <span>₹{pricePerKm}/km</span>
                          <span>× {distanceKm} km</span>
                        </div>
                        <div className="calc-equals">
                          <strong>= ₹{baseFare.toLocaleString()}</strong>
                        </div>
                      </div>
                      <div className="total-breakdown">
                        <div className="amount-row">
                          <span>
                            Driver: ₹{icb.driver_amount.toLocaleString()}
                          </span>
                        </div>
                        <hr />
                        <div className="total-row">
                          <strong>
                            Total: ₹{booking.total_amount.toLocaleString()}
                          </strong>
                        </div>
                      </div>
                    </>
                  )}

                  <p className="status-row">
                    Status: <strong>{booking.status}</strong>
                  </p>
                  <button
                    className="view-details-btn"
                    onClick={() => handleViewDetails(car!.id)}
                  >
                    View Details
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
