import { useState } from "react";
import ChargesCard from "../../components/ChargesCard/ChargesCard";
import "./BookACar.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const BookACar = () => {
  const now = new Date();

  const pad = (num: string | number) => (Number(num) < 10 ? "0" + num : num);

  const currentDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const [pickupDate, setPickupDate] = useState(currentDate);
  const [pickupTime, setPickupTime] = useState(currentTime);
  const [dropDate, setDropDate] = useState(currentDate);
  const [dropTime, setDropTime] = useState(currentTime);
  const [insureTrip, setInsureTrip] = useState(false);
  const [driverRequired, setDriverRequired] = useState(false);
  const [differentDrop, setDifferentDrop] = useState(false);

  // Example pricing logic
  const pricePerHour = 100;
  let carCharges = 0,
    insuranceCharges = 0,
    driverCharges = 0,
    pickDropCharges = 0,
    gst = 0;

  let hours = 1;
  if (pickupDate && dropDate && pickupTime && dropTime) {
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const dropoff = new Date(`${dropDate}T${dropTime}`);
    hours = Math.max(
      1,
      Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60))
    );
  }

  carCharges = pricePerHour * hours;
  insuranceCharges = insureTrip ? 20 * hours : 0;
  driverCharges = driverRequired ? 150 * hours : 0;
  pickDropCharges = differentDrop ? 1000 : 0;

  const subTotal =
    carCharges + insuranceCharges + driverCharges + pickDropCharges;
  gst = Math.round(subTotal * 0.18);

  const photos = [
    "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=600",
    "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&w=600",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % photos.length);
  const prevImage = () =>
    setCurrentImageIndex((i) => (i - 1 + photos.length) % photos.length);

  return (
    <>
      <Navbar />
      <div className="book-car-container">
        {/* Left Section renamed to car-details-section */}
        <div className="car-details-section">
          <div className="breadcrumb">San Francisco / Ford Mustang</div>
          <h1 className="car-title">Ford Mustang</h1>

          {/* Image Carousel */}
          <div className="carousel">
            <button className="prev" onClick={prevImage}>
              &#10094;
            </button>
            <img
              src={photos[currentImageIndex]}
              alt={`Car ${currentImageIndex + 1}`}
              className="carousel-image"
            />
            <button className="next" onClick={nextImage}>
              &#10095;
            </button>
          </div>

          {/* About Section */}
          <div className="about-section-1">
            <h3>About this car</h3>
            <p>
              This Ford Mustang is perfect for a weekend getaway or a road trip.
              It's spacious, comfortable, and has all the features you need for
              a smooth ride. Enjoy the open road with unlimited miles and the
              convenience of an automatic transmission.
            </p>
          </div>

          {/* Trip Section */}
          <div className="trip-section">
            <h3>Zip Your Trip</h3>
            <div className="trip-inputs">
              <div>
                <label>Pick-up Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div>
                <label>Pick-up Time</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              </div>
              <div>
                <label>Drop-off Date</label>
                <input
                  type="date"
                  value={dropDate}
                  onChange={(e) => setDropDate(e.target.value)}
                />
              </div>
              <div>
                <label>Drop-off Time</label>
                <input
                  type="time"
                  value={dropTime}
                  onChange={(e) => setDropTime(e.target.value)}
                />
              </div>
            </div>

            <div className="trip-options">
              <div className="toggle-wrapper">
                <span className="switch-label">Insure Trip</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={insureTrip}
                    onChange={() => setInsureTrip(!insureTrip)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <span className="switch-label">Driver Required</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={driverRequired}
                    onChange={() => setDriverRequired(!driverRequired)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-wrapper">
                <span className="switch-label">
                  Different Drop-off Location
                </span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={differentDrop}
                    onChange={() => setDifferentDrop(!differentDrop)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Charges Summary */}
        <div className="right-section">
          <ChargesCard
            carCharges={carCharges}
            insuranceCharges={insuranceCharges}
            driverCharges={driverCharges}
            pickDropCharges={pickDropCharges}
            gst={gst}
            onPay={() => alert("Proceeding to payment...")}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookACar;
