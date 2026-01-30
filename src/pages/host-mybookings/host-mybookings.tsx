import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { getHostBookings } from "../../services/booking";
import styles from "./host-bookings.module.css";

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
    make: { name: string };
    model: { name: string };
  };
  SelfDriveBooking: any | null;
  IntercityBooking: any | null;
  guest: {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
};

export default function HostMyBookings() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [copiedPhone, setCopiedPhone] = useState<number | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;
      const data = await getHostBookings(token);
      const sorted = data.sort(
        (a: HostBooking, b: HostBooking) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setBookings(sorted);
    };
    fetchBookings();
  }, [token]);

  const handleViewCar = (carId: number) => navigate(`/car-details/${carId}`);

  const handlePhoneClick = async (phone: string, id: number) => {
    await navigator.clipboard.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
    window.location.href = `tel:${phone}`;
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

  if (!bookings.length) {
    return (
      <>
        <Navbar />
        <div className={styles["host-mybookings-container"]}>
          <div className={styles["empty-state"]}>
            <h2>No bookings yet</h2>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles["host-mybookings-container"]}>
        <div className={styles["page-header"]}>
          <h1>Bookings for Your Cars</h1>
          <p className={styles["subtitle"]}>Manage your vehicle reservations</p>
        </div>

        <div className={styles["bookings-list"]}>
          {bookings.map((booking) => {
            const car = booking.Car;
            const guest = booking.guest;
            const sd = booking.SelfDriveBooking;
            const ic = booking.IntercityBooking;
            if (!sd && !ic) return null;

            const image = car?.photos?.[0]?.photo_url || "/default-car.png";
            const baseAmount = sd ? sd.base_amount : ic.base_amount;
            const totalAmount = sd ? sd.total_amount : ic.total_amount;
            const platformFee = totalAmount * 0.1;
            const hostEarnings = totalAmount - platformFee;

            return (
              <div key={booking.id} className={styles["booking-card"]}>
                {/* IMAGE */}
                <div className={styles["booking-image-section"]}>
                  <img
                    src={image}
                    alt=""
                    className={styles["booking-car-image"]}
                  />
                  <span className={styles["booking-type-badge-overlay"]}>
                    {sd ? "Self Drive" : "Intercity"}
                  </span>
                </div>

                {/* MAIN */}
                <div className={styles["booking-main-details"]}>
                  <div className={styles["booking-header-inline"]}>
                    <div className={styles["booking-id-section"]}>
                      <span className={styles["booking-label"]}>
                        Booking ID
                      </span>
                      <span className={styles["booking-id"]}>
                        #{booking.id}
                      </span>
                    </div>

                    <span
                      className={`${styles["status-badge"]} ${
                        styles[getStatusBadgeClass(booking.status)]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className={styles["car-info-inline"]}>
                    <h3 className={styles["car-title"]}>
                      {car.make.name} {car.model.name}
                    </h3>
                    <p className={styles["car-year"]}>{car.year}</p>
                  </div>

                  {/* GUEST */}
                  <div className={styles["guest-info-inline"]}>
                    <div className={styles["guest-header-row"]}>
                      <span className={styles["guest-icon"]}>👤</span>
                      <div className={styles["guest-details"]}>
                        <span className={styles["guest-name"]}>
                          {guest.first_name} {guest.last_name}
                        </span>
                      </div>
                    </div>

                    <div className={styles["guest-actions"]}>
                      <button
                        className={`${styles["action-btn"]} ${styles["call-btn"]}`}
                        onClick={() =>
                          handlePhoneClick(guest.phone, booking.id)
                        }
                      >
                        📞
                      </button>

                      {copiedPhone === booking.id && (
                        <span className={styles["copied-toast"]}>Copied!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRICING */}
                <div className={styles["booking-pricing-section"]}>
                  <h4 className={styles["pricing-title"]}>
                    Earnings Breakdown
                  </h4>

                  <div className={styles["price-summary"]}>
                    <div className={styles["price-row"]}>
                      <span className={styles["price-label"]}>Base Amount</span>
                      <span className={styles["price-value"]}>
                        ₹{baseAmount}
                      </span>
                    </div>

                    <div
                      className={`${styles["price-row"]} ${styles["platform-fee-row"]}`}
                    >
                      <span className={styles["price-label"]}>
                        Platform Fee
                      </span>
                      <span
                        className={`${styles["price-value"]} ${styles["negative"]}`}
                      >
                        -₹{platformFee}
                      </span>
                    </div>

                    <div
                      className={`${styles["price-row"]} ${styles["earnings-row"]}`}
                    >
                      <span className={styles["price-label"]}>
                        Your Earnings
                      </span>
                      <span
                        className={`${styles["price-value"]} ${styles["earnings"]}`}
                      >
                        ₹{hostEarnings}
                      </span>
                    </div>
                  </div>

                  <div className={styles["booking-actions"]}>
                    <button
                      className={styles["view-details-btn"]}
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
      </div>
    </>
  );
}
