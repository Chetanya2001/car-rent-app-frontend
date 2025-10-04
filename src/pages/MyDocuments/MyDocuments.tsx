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
  refreshDocuments: () => void;
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
  refreshDocuments,
}: DocumentSectionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(
    previewUrl || null
  );

  const userToken = localStorage.getItem("token") || "";

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setIdType(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setLocalPreview(URL.createObjectURL(selected));
      if (setVerificationStatus) setVerificationStatus("Pending");
      setMessage(null);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setLocalPreview(previewUrl || null);
    if (setVerificationStatus) setVerificationStatus("Pending");
    setMessage(null);
    setError(null);
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
      setMessage("✅ Document uploaded successfully. Pending verification.");
      setFile(null);
      refreshDocuments(); // ✅ Refresh after upload
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
        className={`doc-status ${
          verificationStatus === "Verified" ? "verified" : ""
        }`}
        style={{ display: "inline-block", marginBottom: 12 }}
      >
        Verification status: {verificationStatus}
      </span>

      {/* ✅ Always show preview (existing or new) */}
      {localPreview ? (
        <div
          style={{
            background: "#f9f9f9",
            borderRadius: "8px",
            padding: "10px",
            marginTop: "12px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <img
            src={localPreview}
            alt={`Preview for ${label}`}
            style={{
              maxWidth: 160,
              borderRadius: 8,
              marginBottom: 8,
              objectFit: "cover",
            }}
          />
          <div style={{ fontWeight: 500 }}>{idType || "No type selected"}</div>
          <div style={{ marginTop: 10 }}>
            <label
              htmlFor={`reupload-${label}`}
              style={{
                cursor: "pointer",
                display: "inline-block",
                padding: "6px 14px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "6px",
                fontWeight: 500,
                marginRight: 8,
              }}
            >
              Reupload
            </label>
            <input
              type="file"
              id={`reupload-${label}`}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            {file && (
              <button
                onClick={handleRemoveFile}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#bb0000",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                ❌ Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            border: "2px dashed #aaa",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
            marginTop: "12px",
            cursor: "pointer",
            userSelect: "none",
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
              marginTop: "8px",
            }}
          >
            Browse
          </label>
          <input
            type="file"
            id={`upload-${label}`}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div style={{ marginTop: "12px", fontWeight: "600" }}>
            Upload document
          </div>
        </div>
      )}

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
          {loading ? "Uploading..." : `Upload / Reupload ${label}`}
        </button>
      </div>

      {error && <div style={{ color: "#bb0000", marginTop: 8 }}>{error}</div>}
      {message && (
        <div
          style={{
            color: "green",
            marginTop: 8,
            fontWeight: 600,
            transition: "opacity 0.3s ease",
          }}
        >
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
      className="profile-pic-section"
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
      {error && <div style={{ color: "#bb0000", marginTop: 8 }}>{error}</div>}
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
  const [id2Status, setId2Status] = useState<string>("No file selected");
  const [id2Url, setId2Url] = useState<string | null>(null);

  const userToken = localStorage.getItem("token") || "";

  const fetchDocuments = async () => {
    try {
      const data = await getUserDocumentsByUserId(userToken);
      const sortedDocs = data.documents
        .filter((doc: { doc_type: string }) => idTypes.includes(doc.doc_type))
        .sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      if (sortedDocs[0]) {
        setId1Type(sortedDocs[0].doc_type);
        setId1Url(sortedDocs[0].image);
        setId1Status(sortedDocs[0].verification_status);
      }
      if (sortedDocs[1]) {
        setId2Type(sortedDocs[1].doc_type);
        setId2Url(sortedDocs[1].image);
        setId2Status(sortedDocs[1].verification_status);
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
        className="verify-identity-page"
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
          Please upload your profile picture and two forms of identification.
        </p>

        {/* Profile Picture */}
        <ProfilePicSection />

        {/* ID Documents */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <DocumentSection
            label="ID 1"
            idType={id1Type}
            setIdType={setId1Type}
            file={id1File}
            setFile={setId1File}
            verificationStatus={id1Status}
            setVerificationStatus={setId1Status}
            previewUrl={id1Url}
            refreshDocuments={fetchDocuments}
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
            refreshDocuments={fetchDocuments}
          />
        </div>
      </div>
    </>
  );
}
