import axios from "axios";
import type { Car } from "../types/Cars";

const API_URL = "http://localhost:5000/api/cars";

export const getCars = async (): Promise<Car[]> => {
  const response = await axios.get<Car[]>(API_URL);
  console.log("🚗 Cars API Response:", response.data); // 👈 log everything
  return response.data;
};

export const addCar = async (carData: {
  make: string;
  model: string;
  year: number;
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/addCar`, carData, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data; // should return { car_id: ... } from your backend
};
