import axios from "axios";
import type { CarDetailsType } from "../types/CarDetails";
import type { UpdateCarPayload } from "../types/EditCar";

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
export const updateCarDetails = async (payload: UpdateCarPayload) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append car_id
    formData.append("car_id", String(payload.car_id));

    // Append features if provided
    if (payload.features) {
      formData.append("features", JSON.stringify(payload.features));
    }

    // Append price if provided
    if (payload.price_per_hour !== undefined) {
      formData.append("price_per_hour", String(payload.price_per_hour));
    }

    // Append insurance company if provided
    if (payload.insurance_company) {
      formData.append("insurance_company", payload.insurance_company);
    }

    // Append insurance IDV if provided
    if (payload.insurance_idv_value !== undefined) {
      formData.append(
        "insurance_idv_value",
        String(payload.insurance_idv_value)
      );
    }

    // Append insurance valid till if provided
    if (payload.insurance_valid_till) {
      formData.append("insurance_valid_till", payload.insurance_valid_till);
    }

    // Append insurance image if provided
    if (payload.insurance_image) {
      formData.append("insurance_image", payload.insurance_image);
    }

    console.log("📤 Sending update request with payload:", {
      car_id: payload.car_id,
      has_features: !!payload.features,
      has_price: !!payload.price_per_hour,
      has_insurance: !!payload.insurance_company,
      has_image: !!payload.insurance_image,
    });

    const response = await axios.put(
      `${API_URL}/api/car-details/update-car-details`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Update successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error updating car:",
      error.response?.data || error.message
    );
    throw error;
  }
};
