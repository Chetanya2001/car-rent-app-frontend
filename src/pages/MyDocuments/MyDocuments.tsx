import React, { useState, useEffect, type ChangeEvent } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  uploadUserDocument,
  uploadProfilePicture,
  getUserDocumentsByUserId,
} from "../../services/userDocuments";

const idTypes: string[] = [
  "Passport",
  "Driver's License",
  "National ID Card",
  "Voter Card",
  "PAN Card",
  "Other",
];

interface DocumentSectionProps {
  label: string;
  idType: string;
  setIdType: React.Dispatch<React.SetStateAction<string>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  verificationStatus: string;
  setVerificationStatus?: React.Dispatch<React.SetStateAction<string>>;
  previewUrl?: string | null;
  onUploadSuccess?: () => void;
}

function DocumentSection({
  label,
  idType,
  setIdType,
  file,
  setFile,
  verificationStatus,
  setVerificationStatus,
  previewUrl,
  onUploadSuccess,
}: DocumentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const userToken = localStorage.getItem("token") || "";

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setIdType(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (setVerificationStatus) setVerificationStatus("Pending");
      setMessage(null);
      setError(null);
    }
  };

  const uploadDocument = async () => {
    if (!idType || !file) {
      setError("Please select ID type and upload a file before submitting.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await uploadUserDocument(file, idType, userToken);
      if (!res.success) throw new Error(res.message || "Upload failed");
      if (setVerificationStatus) setVerificationStatus("Pending");
      setMessage("✅ Document uploaded successfully. Pending verification.");
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-block" style={{ flex: 1, minWidth: 280 }}>
      <h3>{label}</h3>
      <label>ID Type</label>
      <select
        value={idType}
        onChange={handleTypeChange}
        className="doc-dropdown"
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="">Select ID type</option>
        {idTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <span
        style={{
          display: "inline-block",
          marginBottom: 12,
          color:
            verificationStatus === "Verified"
              ? "green"
              : verificationStatus === "Rejected"
              ? "red"
              : "#555",
        }}
      >
        Verification status: {verificationStatus}
      </span>

      {/* Document Preview Section */}
      {previewUrl && !file && (
        <div
          style={{
            background: "#eaffea",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          <img
            src={previewUrl}
            alt={`Uploaded document for ${label}`}
            style={{ maxWidth: 200, borderRadius: 8, marginBottom: 8 }}
          />
          <p style={{ margin: 0 }}>{idType}</p>
          <p style={{ fontSize: "0.9em", color: "#777" }}>
            (You can reupload a new file below)
          </p>
        </div>
      )}

      {/* Upload or Reupload Section */}
      <div
        style={{
          border: "2px dashed #aaa",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          marginTop: "12px",
          cursor: "pointer",
        }}
      >
        <label
          htmlFor={`upload-${label}`}
          style={{
            cursor: "pointer",
            display: "inline-block",
            padding: "8px 22px",
            backgroundColor: "#01d28e",
            color: "#fff",
            borderRadius: "6px",
            fontWeight: 500,
            marginBottom: "8px",
          }}
        >
          {file ? "Change File" : previewUrl ? "Reupload Document" : "Browse"}
        </label>
        <input
          type="file"
          id={`upload-${label}`}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*"
        />

        {file && (
          <div style={{ marginTop: 10 }}>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              style={{ maxWidth: 180, borderRadius: 8 }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={uploadDocument}
          disabled={loading}
          style={{
            background: "#01d28e",
            color: "#fff",
            border: "none",
            fontWeight: "700",
            fontSize: "1em",
            borderRadius: "7px",
            padding: "10px 25px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Uploading..." : `Upload ${label}`}
        </button>
      </div>

      {error && <div style={{ color: "#01d28e", marginTop: 8 }}>{error}</div>}
      {message && (
        <div style={{ color: "green", marginTop: 8, fontWeight: 600 }}>
          {message}
        </div>
      )}
    </div>
  );
}

function ProfilePicSection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userToken = localStorage.getItem("token") || "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setMessage(null);
      setError(null);
    }
  };

  const uploadProfile = async () => {
    if (!file) {
      setError("Please select a profile picture.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await uploadProfilePicture(file, userToken);
      if (!res) throw new Error("Upload failed");
      setMessage("✅ Profile picture uploaded successfully!");
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "30px",
        padding: "20px",
        border: "2px dashed #aaa",
        borderRadius: "12px",
      }}
    >
      <h3>Profile Picture</h3>
      {preview ? (
        <img
          src={preview}
          alt="Profile Preview"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px",
          }}
        />
      ) : (
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "2px dashed #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: "40px",
            color: "#aaa",
          }}
        >
          📷
        </div>
      )}
      <input
        type="file"
        id="profile-pic-upload"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <label
        htmlFor="profile-pic-upload"
        style={{
          cursor: "pointer",
          display: "inline-block",
          padding: "8px 22px",
          backgroundColor: "#01d28e",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: 500,
        }}
      >
        Choose Picture
      </label>
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={uploadProfile}
          disabled={loading}
          style={{
            background: "#01d28e",
            color: "#fff",
            border: "none",
            fontWeight: "700",
            fontSize: "1em",
            borderRadius: "7px",
            padding: "10px 25px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            marginTop: "10px",
          }}
        >
          {loading ? "Uploading..." : "Upload Profile Picture"}
        </button>
      </div>
      {error && <div style={{ color: "#01d28e", marginTop: 8 }}>{error}</div>}
      {message && (
        <div style={{ color: "green", marginTop: 8, fontWeight: 600 }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default function MyDocumentsPage() {
  const [id1Type, setId1Type] = useState<string>("");
  const [id1File, setId1File] = useState<File | null>(null);
  const [id1Status, setId1Status] = useState<string>("Pending");
  const [id1Url, setId1Url] = useState<string | null>(null);

  const [id2Type, setId2Type] = useState<string>("");
  const [id2File, setId2File] = useState<File | null>(null);
  const [id2Status, setId2Status] = useState<string>("Pending");
  const [id2Url, setId2Url] = useState<string | null>(null);

  const userToken = localStorage.getItem("token") || "";

  const fetchDocuments = async () => {
    try {
      const data = await getUserDocumentsByUserId(userToken);
      const docs = data.documents || [];

      if (docs[0]) {
        setId1Type(docs[0].doc_type);
        setId1Url(docs[0].image);
        setId1Status(docs[0].verification_status);
      }
      if (docs[1]) {
        setId2Type(docs[1].doc_type);
        setId2Url(docs[1].image);
        setId2Status(docs[1].verification_status);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [userToken]);

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: "650px",
          margin: "40px auto",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 0 10px #eee",
          padding: "30px 40px",
        }}
      >
        <h2 style={{ fontWeight: "800" }}>Verify Your Identity</h2>
        <p style={{ marginBottom: "24px", color: "#555" }}>
          Please upload your profile picture and 2 ID documents. If already
          uploaded, you can preview and reupload new ones.
        </p>

        <ProfilePicSection />

        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
          <DocumentSection
            label="ID 1"
            idType={id1Type}
            setIdType={setId1Type}
            file={id1File}
            setFile={setId1File}
            verificationStatus={id1Status}
            setVerificationStatus={setId1Status}
            previewUrl={id1Url}
            onUploadSuccess={fetchDocuments}
          />
          <DocumentSection
            label="ID 2"
            idType={id2Type}
            setIdType={setId2Type}
            file={id2File}
            setFile={setId2File}
            verificationStatus={id2Status}
            setVerificationStatus={setId2Status}
            previewUrl={id2Url}
            onUploadSuccess={fetchDocuments}
          />
        </div>
      </div>
    </>
  );
}
