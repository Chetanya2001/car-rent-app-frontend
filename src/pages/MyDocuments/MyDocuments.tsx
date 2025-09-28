import React, { useState, type ChangeEvent, type FormEvent } from "react";
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
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setIdType(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (setVerificationStatus) setVerificationStatus("Pending");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (setVerificationStatus) setVerificationStatus("Pending");
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
          <div
            className="file-display"
            style={{
              background: "#eaffea",
              borderRadius: "8px",
              padding: "10px",
              marginTop: "12px",
              position: "relative",
            }}
          >
            <b>{file.name}</b>
            <br />
            Uploaded on {new Date().toLocaleDateString()}
            <button
              style={{
                position: "absolute",
                right: 8,
                top: 8,
                background: "transparent",
                border: "none",
                color: "#bb0000",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={handleRemoveFile}
              aria-label={`Remove file for ${label}`}
            >
              🗑️
            </button>
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
      </div>
    </>
  );
}

export default function MyDocumentsPage() {
  const [id1Type, setId1Type] = useState<string>("");
  const [id1File, setId1File] = useState<File | null>(null);
  const [id1Status, setId1Status] = useState<string>("Pending");

  const [id2Type, setId2Type] = useState<string>("");
  const [id2File, setId2File] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Retrieve token from auth or storage
  const userToken = localStorage.getItem("token") || "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!id1Type || !id1File) {
      setError("Please select ID type and upload a file for ID 1.");
      setLoading(false);
      return;
    }
    if (!id2Type || !id2File) {
      setError("Please select ID type and upload a file for ID 2.");
      setLoading(false);
      return;
    }

    try {
      // Upload first document
      const res1 = await uploadUserDocument(id1File, id1Type, userToken);
      if (!res1.success) throw new Error(res1.message);

      setId1Status("Pending");

      // Upload second document
      const res2 = await uploadUserDocument(id2File, id2Type, userToken);
      if (!res2.success) throw new Error(res2.message);

      setMessage("Documents uploaded successfully. Pending verification.");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <form
        className="verify-identity-page"
        onSubmit={handleSubmit}
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
          To ensure the security of your account, we need to verify your
          identity. Please upload two forms of identification from the options
          below.
        </p>
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
          />
          <DocumentSection
            label="ID 2"
            idType={id2Type}
            setIdType={setId2Type}
            file={id2File}
            setFile={setId2File}
            verificationStatus={id2File ? "Pending" : "No file selected"}
          />
        </div>

        {error && (
          <div style={{ color: "#bb0000", marginBottom: "12px" }}>{error}</div>
        )}

        {message && (
          <div style={{ color: "#008800", marginBottom: "12px" }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#01d28e",
            color: "#fff",
            border: "none",
            fontWeight: "700",
            fontSize: "1.08em",
            borderRadius: "7px",
            padding: "13px 35px",
            float: "right",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Uploading..." : "Submit for Verification"}
        </button>
      </form>
    </>
  );
}
