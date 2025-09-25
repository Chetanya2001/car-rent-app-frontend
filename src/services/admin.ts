import axios from "axios";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "admin" | "host" | "guest";
  is_verified: boolean;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export const getAllUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");

  const response = await axios.get<User[]>(`${API_URL}/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
