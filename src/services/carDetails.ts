import axios from "axios";
import type { CarDetailsType } from "../types/CarDetails";

// ✅ Use env variable for API base
const API_URL = `${import.meta.env.VITE_API_URL}/api/car-details/getCarDetails`;

// 📌 Get Car Details by ID (car_id in body)
export const getCarDetails = async (
  car_id: number
): Promise<CarDetailsType> => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      API_URL,
      { car_id },
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    console.log("📥 Car Details Response:", response.data);

    return response.data as CarDetailsType;
  } catch (error: any) {
    console.error(
      "❌ Error fetching car details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
