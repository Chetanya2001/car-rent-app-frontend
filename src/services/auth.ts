import axios from "axios";
import type { UserRegister, UserLogin, AuthResponse } from "../types/user";

const API_URL = "http://localhost:5000/api/users";

export const registerUser = async (
  data: UserRegister
): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    console.log("Register response:", res.status, res.data);
    return res.data;
  } catch (err: any) {
    console.error(
      "Error registering user:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Registration failed");
  }
};

export const loginUser = async (data: UserLogin): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    console.log("Login response:", res.status, res.data);
    return res.data;
  } catch (err: any) {
    console.error(
      "Error logging in:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Login failed");
  }
};
