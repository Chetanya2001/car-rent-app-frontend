import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user-document`;

export interface UserDocument {
  id: number;
  doc_type: string;
  image: string;
  verification_status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data: UserDocument;
}

export interface GetDocumentsResponse {
  success: boolean;
  data: {
    user: {
      id: number;
      email: string;
    };
    documents: UserDocument[];
  };
}

// Upload user document (with image file)
export async function uploadUserDocument(
  file: File,
  doc_type: string,
  token: string
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("doc_type", doc_type);

  const response = await axios.post<UploadDocumentResponse>(
    `${API_URL}/upload-id`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// Get user documents by userId (admin only)
export async function getUserDocumentsByUserId(
  userId: number,
  token: string
): Promise<GetDocumentsResponse> {
  const response = await axios.get<GetDocumentsResponse>(
    `${API_URL}/get-document`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        userId,
      },
    }
  );
  return response.data;
}
