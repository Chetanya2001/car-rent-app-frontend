import React, { useState, type ChangeEvent } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { uploadUserDocument } from "../../services/userDocuments";

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
}

function DocumentSection({
  label,
  idType,
  setIdType,
  file,
  setFile,
  verificationStatus,
  setVerificationStatus,
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

  const handleRemoveFile = () => {
    setFile(null);
    if (setVerificationStatus) setVerificationStatus("Pending");
    setMessage(null);
    setError(null);
  };

  const uploadDocument = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!idType || !file) {
      setError("Please select ID type and upload a file before submitting.");
      setLoading(false);
      return;
    }

    try {
      const res = await uploadUserDocument(file, idType, userToken);
      if (!res.success) throw new Error(res.message);

      if (setVerificationStatus) setVerificationStatus("Pending");
      setMessage("Document uploaded successfully. Pending verification.");
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        {file ? (
          <div className="file-display">
            <b>{file.name}</b>
            <br />
            Uploaded on {new Date().toLocaleDateString()}
            <button
              className="doc-delete-btn"
              onClick={handleRemoveFile}
              aria-label={`Remove file for ${label}`}
            >
              🗑️
            </button>
          </div>
        ) : (
          <div className="doc-upload-area">
            <label
              htmlFor={`upload-${label}`}
              className="browse-btn"
              style={{ marginTop: 0 }}
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
            <div style={{ marginTop: "12px", fontWeight: 600 }}>
              Upload document
            </div>
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            onClick={uploadDocument}
            disabled={loading}
            className="verify-btn"
            style={{ float: "none" }}
          >
            {loading ? "Uploading..." : `Upload ${label}`}
          </button>
        </div>
        {error && <div style={{ color: "#bb0000", marginTop: 8 }}>{error}</div>}
        {message && (
          <div style={{ color: "#008800", marginTop: 8 }}>{message}</div>
        )}
      </div>
    </>
  );
}

// PROFILE PICTURE SECTION COMPONENT
function ProfilePicSection() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userToken = localStorage.getItem("token") || "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setMessage(null);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setMessage(null);
    setError(null);
  };

  const uploadProfilePic = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!file) {
      setError("Please select a profile image before submitting.");
      setLoading(false);
      return;
    }
    try {
      // Upload as type "Profile Picture"
      const res = await uploadUserDocument(file, "Profile Picture", userToken);
      if (!res.success) throw new Error(res.message);
      setMessage("Profile picture uploaded successfully.");
    } catch (err: any) {
      setError(err?.message || "Profile upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doc-block profile-block" style={{ flex: 1, minWidth: 280 }}>
      <h3>Profile Picture</h3>
      {preview ? (
        <div
          className="file-display"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src={preview}
            alt="Profile Preview"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #01d28e",
              marginRight: 6,
            }}
          />
          <div style={{ flex: 1 }}>
            <b>{file?.name}</b>
            <br />
            Selected on {new Date().toLocaleDateString()}
          </div>
          <button
            className="doc-delete-btn"
            onClick={handleRemoveFile}
            aria-label="Remove profile picture"
          >
            🗑️
          </button>
        </div>
      ) : (
        <div className="doc-upload-area">
          <label
            htmlFor="upload-profile-pic"
            className="browse-btn"
            style={{ marginTop: 0 }}
          >
            Browse
          </label>
          <input
            type="file"
            id="upload-profile-pic"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <div style={{ marginTop: 12, fontWeight: 600 }}>
            Upload a clear profile image
          </div>
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={uploadProfilePic}
          disabled={loading}
          className="verify-btn"
          style={{ float: "none" }}
        >
          {loading ? "Uploading..." : "Upload Profile Picture"}
        </button>
      </div>
      {error && <div style={{ color: "#bb0000", marginTop: 8 }}>{error}</div>}
      {message && (
        <div style={{ color: "#008800", marginTop: 8 }}>{message}</div>
      )}
    </div>
  );
}

export default function MyDocumentsPage() {
  const [id1Type, setId1Type] = useState<string>("");
  const [id1File, setId1File] = useState<File | null>(null);
  const [id1Status, setId1Status] = useState<string>("Pending");

  const [id2Type, setId2Type] = useState<string>("");
  const [id2File, setId2File] = useState<File | null>(null);
  const [id2Status, setId2Status] = useState<string>("No file selected");

  return (
    <>
      <Navbar />
      <div className="verify-identity-page">
        <h2>Verify Your Identity</h2>
        <p>
          To ensure the security of your account, we need to verify your
          identity. Please upload two forms of identification and your profile
          picture.
        </p>
        <div className="docs-flex-row">
          <ProfilePicSection />
        </div>
        <div className="docs-flex-row">
          <DocumentSection
            label="ID 1"
            idType={id1Type}
            setIdType={setId1Type}
            file={id1File}
            setFile={setId1File}
            verificationStatus={id1Status}
            setVerificationStatus={setId1Status}
          />
          <DocumentSection
            label="ID 2"
            idType={id2Type}
            setIdType={setId2Type}
            file={id2File}
            setFile={setId2File}
            verificationStatus={id2Status}
            setVerificationStatus={setId2Status}
          />
        </div>
      </div>
    </>
  );
}
