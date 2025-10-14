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
  const bookings: Booking[] = []; // no data for now

  if (bookings.length === 0) {
    return (
      <div className="no-bookings-container">
        <p className="no-bookings-text">You have no bookings yet.</p>
        <button className="book-now-btn">Book Now</button>
      </div>
    );
  }

  return (
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
  );
}
