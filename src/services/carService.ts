import axios from "axios";
import type { Car } from "../types/Cars";

// ✅ Use env variable
const API_URL = `${import.meta.env.VITE_API_URL}/api/cars`;

export const getCars = async (): Promise<Car[]> => {
  const response = await axios.get<Car[]>(API_URL);
  console.log("🚗 Cars API Response:", response.data);
  return response.data;
};

export const addCar = async (carData: {
  make: string;
  model: string;
  year: number;
  description: string;
}) => {
  const token = localStorage.getItem("token");
  console.log("📤 Sending Car Data:", carData);
  const response = await axios.post(`${API_URL}/addCar`, carData, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

export const uploadRC = async (rcData: {
  car_id: number;
  owner_name: string;
  rc_number: string;
  rc_valid_till: string;
  city_of_registration: string;
  rc_image_front: File;
  rc_image_back: File;
}) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("car_id", rcData.car_id.toString());
  formData.append("owner_name", rcData.owner_name);
  formData.append("rc_number", rcData.rc_number);
  formData.append("rc_valid_till", rcData.rc_valid_till);
  formData.append("city_of_registration", rcData.city_of_registration);
  formData.append("rc_image_front", rcData.rc_image_front);
  formData.append("rc_image_back", rcData.rc_image_back);

  console.log("📤 Sending RC Data:");
  formData.forEach((value, key) => console.log(`${key}:`, value));

  const response = await axios.post(`${API_URL}/addRC`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};

export const addInsurance = async (insuranceData: {
  car_id: number;
  insurance_company: string;
  insurance_idv_value: number;
  insurance_valid_till: string;
  insurance_image: File;
}) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("car_id", String(insuranceData.car_id));
  formData.append("insurance_company", insuranceData.insurance_company);
  formData.append(
    "insurance_idv_value",
    String(insuranceData.insurance_idv_value)
  );
  formData.append("insurance_valid_till", insuranceData.insurance_valid_till);
  formData.append("insurance_image", insuranceData.insurance_image);

  console.log("📤 Sending Insurance Data:");
  formData.forEach((value, key) => console.log(`${key}:`, value));

  const response = await axios.post(`${API_URL}/addInsurance`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};

export const uploadImages = async (carId: number, images: File[]) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("car_id", carId.toString());
  images.forEach((image) => {
    formData.append("images", image, image.name);
  });

  console.log("📤 Sending Image Upload Data:");
  formData.forEach((value, key) => console.log(`${key}:`, value));

  const response = await axios.post(`${API_URL}/addImage`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};

export const uploadAvailability = async (availabilityData: {
  car_id: number;
  price_per_hour: number;
  available_from: string;
  available_till: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/more-details`,
    availabilityData,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  return response.data;
};

export const searchCars = async (searchData: {
  city: string;
  pickup_datetime: string;
  dropoff_datetime: string;
}) => {
  const token = localStorage.getItem("token");

  console.log("📤 Sending Search Data:", searchData);

  const response = await axios.post(`${API_URL}/search`, searchData, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  console.log("🔎 Search Cars Response:", response.data);

  return response.data;
};

export const getHostCars = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found. Please login first.");

    const response = await axios.post(
      `${API_URL}/my-host-cars`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("❌ getHostCars error:", err.response?.data || err.message);
    throw err;
  }
};

export const getCarById = async (id: number): Promise<Car> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
