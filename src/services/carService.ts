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

  // ✅ Debug log
  console.log("📤 Sending RC Data:");
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  const response = await axios.post(`${API_URL}/addRC`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data; // will contain { message, data }
};

export const addInsurance = async (insuranceData: {
  car_id: number;
  insurance_company: string;
  insurance_idv_value: number;
  insurance_valid_till: string;
  insurance_image: File;
}) => {
  const token = localStorage.getItem("token");

  // Create FormData to handle file upload
  const formData = new FormData();
  formData.append("car_id", String(insuranceData.car_id));
  formData.append("insurance_company", insuranceData.insurance_company);
  formData.append(
    "insurance_idv_value",
    String(insuranceData.insurance_idv_value)
  );
  formData.append("insurance_valid_till", insuranceData.insurance_valid_till);
  formData.append("insurance_image", insuranceData.insurance_image);

  // ✅ Debug log
  console.log("📤 Sending Insurance Data:");
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

  const response = await axios.post(`${API_URL}/addInsurance`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data; // will contain { message, data }
};

export const uploadImages = async (carId: number, images: File[]) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  // Append car_id
  formData.append("car_id", carId.toString());

  // Append each image file
  images.forEach((image) => {
    formData.append("images", image, image.name); // Use "images" as the field name for multiple files
  });

  // ✅ Debug log
  console.log("📤 Sending Image Upload Data:");
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });

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
    // Get JWT token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No auth token found. Please login first.");
    }

    // Make POST request to backend
    const response = await axios.post(
      "http://localhost:5000/api/cars/my-host-cars",
      {}, // POST body can be empty if backend only uses token
      {
        headers: {
          Authorization: `Bearer ${token}`, // Backend expects this
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Expecting: { cars: [...] }
  } catch (err: any) {
    console.error("❌ getHostCars error:", err.response?.data || err.message);
    throw err;
  }
};
