// src/services/booking.ts
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/bookings`;

// The booking input type matches your API needs
export interface BookCarRequest {
  car_id: number;
  start_datetime: string;
  end_datetime: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_long: number;
  drop_address: string;
  drop_lat: number;
  drop_long: number;
  insure_amount?: number;
  driver_amount?: number;
  // you can add more fields as required
}

// The response type can be extended if needed
export interface BookCarResponse {
  message: string;
  booking: any; // type this in detail if you want
}

// Auth is passed via Bearer token (from localStorage)
export const bookCar = async (
  bookingData: BookCarRequest,
  token: string // pass your JWT token
): Promise<BookCarResponse> => {
  try {
    const res = await axios.post<BookCarResponse>(
      `${API_URL}/book-car`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error booking car:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Booking failed");
  }
};
export const getAllBookingsAdmin = async (token: string): Promise<any[]> => {
  try {
    const res = await axios.get<any[]>(`${API_URL}/admin/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error fetching admin bookings:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Failed to fetch admin bookings");
  }
};

export const getHostBookings = async (token: string): Promise<any[]> => {
  try {
    const res = await axios.get<any[]>(`${API_URL}/host/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error fetching host bookings:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Failed to fetch host bookings");
  }
};
export const getGuestBookings = async (token: string): Promise<any[]> => {
  try {
    const res = await axios.get<any[]>(`${API_URL}/guest/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error(
      "❌ Error fetching guest bookings:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err.response?.data || new Error("Failed to fetch guest bookings");
  }
};
