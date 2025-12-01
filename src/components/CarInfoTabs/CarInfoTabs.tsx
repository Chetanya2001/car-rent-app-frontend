import React from "react";
import type { CarFeatures } from "../../types/CarDetails"; // adjust path

interface Props {
  description: string | null;
  features: CarFeatures;
  reviews: Review[];
}
interface Review {
  user: string;
  rating: number;
  comment: string;
}

const CarInfoTabs: React.FC<Props> = ({ description, features, reviews }) => {
  // Convert true features → readable list
  const featureList = Object.entries(features)
    .filter(([, value]) => value === true)
    .map(
      ([key]) =>
        key
          .replace(/_/g, " ") // convert snake_case → normal text
          .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize
    );

  return (
    <div className="container mt-4">
      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className="nav-link active"
            data-bs-toggle="tab"
            data-bs-target="#desc"
          >
            Description
          </button>
        </li>

        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#features"
          >
            Features
          </button>
        </li>

        <li className="nav-item">
          <button
            className="nav-link"
            data-bs-toggle="tab"
            data-bs-target="#reviews"
          >
            Reviews
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content p-3 border border-top-0">
        {/* Description */}
        <div className="tab-pane fade show active" id="desc">
          <p>{description}</p>
        </div>

        {/* Features */}
        <div className="tab-pane fade" id="features">
          {featureList.length === 0 ? (
            <p>No features available.</p>
          ) : (
            <ul className="list-group">
              {featureList.map((f, i) => (
                <li key={i} className="list-group-item">
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reviews */}
        <div className="tab-pane fade" id="reviews">
          {reviews?.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="mb-3 border p-2 rounded">
                <strong>{r.user}</strong> – ⭐ {r.rating}/5
                <p className="mb-0">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarInfoTabs;
