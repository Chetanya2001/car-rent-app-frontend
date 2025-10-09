import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  sendSupportMessage,
  type SupportFormData,
} from "../../services/support";
import LocationPicker from "../../components/Map/LocationPicker";
import "./support.css";

export default function Support() {
  const [form, setForm] = useState<SupportFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Update form state on inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // On location selection from map
  const handleLocationSelect = (loc: typeof location) => {
    setLocation(loc);
  };

  // On form submit, send support message with location appended to message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Append location details to message body if available
      const locationStr =
        location.city || location.state || location.country
          ? `\n\nLocation:\nCity: ${location.city}\nState: ${location.state}\nCountry: ${location.country}`
          : "";

      const response = await sendSupportMessage({
        ...form,
        message: form.message + locationStr,
      });
      setSuccessMsg(response.message);
      setForm({ name: "", email: "", subject: "", message: "" });
      setLocation({ city: "", state: "", country: "", lat: null, lng: null });
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="support-page">
        <div className="support-grid">
          {/* Left Info Cards */}
          <div className="support-info-cards">
            <div className="support-card">
              <div className="support-card-title">Address</div>
              <div className="support-card-value">
                I-Thum Business Park Sector 62
                <br />
                Noida India 201301
              </div>
            </div>
            <div className="support-card">
              <div className="support-card-title">Phone</div>
              <div className="support-card-value">+91 9837 3354</div>
            </div>
            <div className="support-card">
              <div className="support-card-title">Email</div>
              <div className="support-card-value">support@zipdrive.in</div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="support-form" onSubmit={handleSubmit}>
            <h2>Contact Support</h2>

            {successMsg && <p className="success-msg">{successMsg}</p>}
            {error && <p className="error-msg">{error}</p>}

            <div className="input-grid">
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input"
                disabled={loading}
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
                disabled={loading}
              />
              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="input"
                disabled={loading}
              />
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
                className="textarea"
                rows={4}
                disabled={loading}
              />
              <button type="submit" className="support-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>

            <div style={{ marginTop: "24px" }}>
              {/* Insert LocationPicker below form inputs */}
              <LocationPicker onSelect={handleLocationSelect} />

              {/* Display selected address below map */}
              {(location.city || location.state || location.country) && (
                <p className="selected-location">
                  <strong>Selected Location:</strong> {location.city},{" "}
                  {location.state}, {location.country}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
