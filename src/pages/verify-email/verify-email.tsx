import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Force HTTP because your backend is only running on HTTP (port 4000)
    const apiBase = "http://65.2.128.59:4000";

    console.log(
      "Verifying with URL:",
      `${apiBase}/api/users/verify-email?token=${token}`,
    );

    fetch(`${apiBase}/api/users/verify-email?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setMessage("✅ Your email has been verified successfully!");
          setTimeout(() => navigate("/?showLogin=true"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Email verification failed.");
        }
      })
      .catch((err) => {
        console.error("Verification fetch error:", err);
        setStatus("error");
        setMessage(
          "Cannot connect to the server. Make sure the backend is running on http://65.2.128.59:4000",
        );
      });
  }, [location, navigate]);

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
          <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{message}</p>
          <button
            onClick={() => navigate("/?showLogin=true")}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Go to Login
          </button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
