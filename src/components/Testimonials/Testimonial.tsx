import { useState } from "react";
import "./Testimonial.css";

import user1 from "../../assets/amit.jpeg";
import user2 from "../../assets/ankit.jfif";
import user3 from "../../assets/ashwani.jpeg";

import type { Testimonial } from "../../types/Testimonial";

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      img: user1,
      place: "Visited family (Feb 2025)",
      text: "Seamless experience of renting a self-driven car through Zip Drive. Host dropped the car at airport. Cosy car – easy Zipping!",
      name: "Ankit Jain",
      role: "Travel consultant, Melbourne",
    },
    {
      img: user2,
      place: "Visited Mahakumbh (Feb 2025)",
      text: "I was always looking for a reliable company to get self drive cars. Delighted I found Zip Drive. Timely Pick/Drop service and clean car made my experience smooth.",
      name: "Mohit Jain",
      role: "Marketing Manager, Dubai",
    },
    {
      img: user3,
      place: "NCR Delhi (Feb 2025)",
      text: "I had to come to India for my visa renewal. Zip Drive helped me with the car for 15 days. Excellent customer focus and service.",
      name: "Krishanu",
      role: "Engineer, US",
    },
    {
      img: user1,
      place: "Weekend Getaway (Mar 2025)",
      text: "Zip Drive made our weekend trip unforgettable! The car was in great condition and the service was top-notch.",
      name: "Riya Sharma",
      role: "Photographer, New York",
    },
    {
      img: user2,
      place: "Business Trip (Apr 2025)",
      text: "I needed a reliable car for my business trip and Zip Drive delivered. The process was smooth and the car was perfect for my needs.",
      name: "Amit Verma",
      role: "Entrepreneur, London",
    },
    {
      img: user3,
      place: "Family Vacation (May 2025)",
      text: "Our family vacation was made easier with Zip Drive. The car was spacious and comfortable, making our journey enjoyable.",
      name: "Sneha Kapoor",
      role: "Teacher, Sydney",
    },
    {
      img: user1,
      place: "City Exploration (Jun 2025)",
      text: "Exploring the city was a breeze with Zip Drive. The car was easy to drive and perfect for navigating through traffic.",
      name: "Vikram Singh",
      role: "Blogger, Toronto",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Show 3 testimonials at a time
  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + 3);

  const handleNext = () => {
    if (activeIndex < testimonials.length - 3) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <h5 className="section-subtitle">TESTIMONIALS</h5>
      <h2 className="section-title">Happy Zippers !</h2>

      <div className="testimonial-container">
        {visibleTestimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <img src={t.img} alt={t.name} className="testimonial-img" />
            <h4 className="testimonial-place">{t.place}</h4>
            <p className="testimonial-text">{t.text}</p>
            <h3 className="testimonial-name">{t.name}</h3>
            <span className="testimonial-role">{t.role}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="testimonial-controls">
        <button onClick={handlePrev} disabled={activeIndex === 0}>
          ◀
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex >= testimonials.length - 3}
        >
          ▶
        </button>
      </div>
    </section>
  );
}
