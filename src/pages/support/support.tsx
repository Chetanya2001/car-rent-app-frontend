import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./support.css";
// Add your CSS according to your design system

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle submission (API or feedback)
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
            <div className="input-grid">
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
              />
              <input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="input"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
                className="textarea"
                rows={4}
              />
              <button type="submit" className="support-btn">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
