import { useEffect, useState } from "react";
import { toIST } from "../../utils/time";

import "./PickupOTP.css";

interface PickupOTPProps {
  bookingId: number;
  pickupDateTime: string; // ISO format datetime
  bookingStatus: string;
}

export default function PickupOTP({
  bookingId,
  pickupDateTime,
  bookingStatus,
}: PickupOTPProps) {
  const [otp, setOtp] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeUntilVisible, setTimeUntilVisible] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate if OTP should be visible (30 mins before pickup)
  const checkOTPVisibility = () => {
    const now = new Date();
    const pickup = toIST(pickupDateTime);

    const thirtyMinsBefore = new Date(pickup.getTime() - 30 * 60 * 1000);

    // OTP visible if: current time >= 30 mins before pickup AND before pickup time
    const shouldBeVisible = now >= thirtyMinsBefore && now < pickup;

    setIsVisible(shouldBeVisible);

    // Calculate time remaining until OTP becomes visible
    if (!shouldBeVisible && now < thirtyMinsBefore) {
      const diff = thirtyMinsBefore.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeUntilVisible(`${hours}h ${minutes}m`);
      } else {
        setTimeUntilVisible(`${minutes} mins`);
      }
    } else if (now >= pickup) {
      setTimeUntilVisible("Pickup time passed");
    }

    return shouldBeVisible;
  };

  // Fetch OTP from API when visible
  const fetchOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      // Replace with your actual API endpoint
      const response = await fetch(`/api/bookings/${bookingId}/pickup-otp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch OTP");
      }

      const data = await response.json();
      setOtp(data.otp || data.pickup_otp);
    } catch (err) {
      console.error("Error fetching OTP:", err);
      setError("Unable to load OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check visibility and fetch OTP on mount and every minute
  useEffect(() => {
    const shouldFetch = checkOTPVisibility();

    if (shouldFetch && !otp && bookingStatus === "CONFIRMED") {
      fetchOTP();
    }

    // Update every minute
    const interval = setInterval(() => {
      const shouldFetch = checkOTPVisibility();

      if (shouldFetch && !otp && bookingStatus === "CONFIRMED") {
        fetchOTP();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [bookingId, pickupDateTime, otp, bookingStatus]);

  // Don't render anything if booking is not confirmed
  if (bookingStatus !== "CONFIRMED") {
    return null;
  }

  // Show countdown if not yet visible
  if (!isVisible) {
    return (
      <div className="pickup-otp-container">
        <div className="otp-inactive">
          <div className="otp-icon">🔒</div>
          <p className="otp-label">PICKUP OTP</p>
          <p className="otp-countdown">
            {timeUntilVisible ? (
              <>
                Available in <strong>{timeUntilVisible}</strong>
              </>
            ) : (
              "Not available yet"
            )}
          </p>
          <p className="otp-info">OTP will be visible 30 mins before pickup</p>
        </div>
      </div>
    );
  }

  // Show OTP when visible
  return (
    <div className="pickup-otp-container">
      <div className="otp-active">
        <p className="otp-label">PICKUP OTP</p>
        {isLoading ? (
          <div className="otp-loading">
            <div className="spinner"></div>
            <p>Loading OTP...</p>
          </div>
        ) : error ? (
          <div className="otp-error">
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchOTP}>
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="otp-display">
              {otp?.split("").map((digit, index) => (
                <div key={index} className="otp-digit">
                  {digit}
                </div>
              ))}
            </div>
            <p className="otp-instruction">
              <span className="required-badge">REQUIRED FOR ACCESS</span>
            </p>
            <div className="otp-timer">
              <span className="active-indicator">●</span>
              <span>Active 30 mins before pickup</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
