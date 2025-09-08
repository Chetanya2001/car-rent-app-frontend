import axios from "axios";
import type { Car } from "../types/Cars";

const API_URL = "http://localhost:5000/api/cars";

export const getCars = async (): Promise<Car[]> => {
  const response = await axios.get<Car[]>(API_URL);
  console.log("🚗 Cars API Response:", response.data); // 👈 log everything
  return response.data;
};
