import React, { useState } from "react";
import type { CarDetailsType } from "../../types/CarDetails";

interface Feature {
  name: string;
  active: boolean;
}

interface Props {
  car: CarDetailsType;
}

const CarTabs: React.FC<Props> = ({ car }) => {
  const [activeTab, setActiveTab] = useState<
    "features" | "description" | "review"
  >("features");

  // Convert features into array
  let features: Feature[] = Array.isArray(car.features)
    ? car.features
    : Object.entries(car.features || {}).map(([name, active]) => ({
        name,
        active: Boolean(active),
      }));

  // Split into 3 columns
  const chunkSize = Math.ceil(features.length / 3);
  const columns = [
    features.slice(0, chunkSize),
    features.slice(chunkSize, chunkSize * 2),
    features.slice(chunkSize * 2),
  ];

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Tabs header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        {["features", "description", "review"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{
              background: "none",
              border: "none",
              margin: "0 20px",
              padding: "10px 0",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: activeTab === tab ? "#007bff" : "#888",
              borderBottom: activeTab === tab ? "2px solid #007bff" : "none",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: "180px" }}>
        {activeTab === "features" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px 30px",
            }}
          >
            {columns.map((column, idx) => (
              <ul
                key={idx}
                style={{ listStyle: "none", padding: 0, margin: 0 }}
              >
                {column.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "12px",
                      fontSize: "15px",
                      color: f.active ? "green" : "red",
                    }}
                  >
                    <span style={{ width: "20px", display: "inline-block" }}>
                      {f.active ? "✔" : "✘"}
                    </span>
                    <span style={{ color: "#333" }}>{f.name}</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}

        {activeTab === "description" && (
          <p style={{ fontSize: "15px", color: "#555" }}>
            {car.description || "No description available."}
          </p>
        )}

        {activeTab === "review" && (
          <p style={{ fontSize: "15px", color: "#555" }}>
            Reviews will go here...
          </p>
        )}
      </div>
    </div>
  );
};

export default CarTabs;
