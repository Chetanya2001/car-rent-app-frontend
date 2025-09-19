import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function VerifyEmail() {
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Call backend API to verify email
    fetch(
      `${import.meta.env.VITE_API_URL}/api/users/verify-email?token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Email verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please Try again.");
      });
  }, [location]);

  // Simple dialog UI
  return (
    <div
      style={{
        padding: 20,
        maxWidth: 500,
        margin: "50px auto",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      {status === "loading" && <p>Verifying your email...</p>}
      {(status === "success" || status === "error") && (
        <>
          <h2>{status === "success" ? "Success!" : "Error"}</h2>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
