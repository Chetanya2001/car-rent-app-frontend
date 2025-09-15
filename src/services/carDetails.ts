import axios from "axios";
import type { CarDetails } from "../types/CarDetails";

const API_URL = "http://localhost:5000/api/car-details/getCarDetails";

// 📌 Get Car Details by ID (car_id in body)
export const getCarDetails = async (car_id: number): Promise<CarDetails> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      API_URL, // ✅ updated route
      { car_id }, // Send car_id in body
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    console.log("📥 Car Details Response:", response.data);

    return response.data as CarDetails;
  } catch (error: any) {
    console.error(
      "❌ Error fetching car details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
