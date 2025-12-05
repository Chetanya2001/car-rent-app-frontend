import axios from "axios";
import type { CarFeatures } from "../types/Cars";

// ✅ Use env variable instead of hardcoding
const API_URL = `${import.meta.env.VITE_API_URL}/car-features`;

export const addCarFeatures = async (carFeaturesData: CarFeatures) => {
  const token = localStorage.getItem("token");

  // ✅ Debug log
  console.log("📤 Sending Car Features Data:", carFeaturesData);

  const response = await axios.post(API_URL, carFeaturesData, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data; // will contain { message, data } or the created CarFeatures object
};
