import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth"; // your axios login API

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // 🚀 prevent page refresh
    setError("");

    try {
      const res = await loginUser({ email, password });
      console.log("Login successful:", res);

      // Save token or user data in localStorage
      localStorage.setItem("token", res.token);

      // Redirect to dashboard/home
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <div className="row g-0">
          {/* Left side: Form */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h2 className="fw-bold mb-2">Welcome back</h2>
            <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              Please enter your details to sign in.
            </p>

            <form className="d-flex flex-column gap-3" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="form-label fw-semibold small text-uppercase text-secondary mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ fontSize: "0.9rem", padding: "0.55rem 0.75rem" }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="form-label fw-semibold small text-uppercase text-secondary mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ fontSize: "0.9rem", padding: "0.55rem 0.75rem" }}
                />
              </div>

              {/* Forgot password */}
              <div className="d-flex justify-content-end">
                <a
                  href="#"
                  className="text-decoration-none fw-medium text-primary small"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error message */}
              {error && (
                <div className="alert alert-danger py-2 small">{error}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 shadow-sm"
                style={{ fontSize: "0.95rem", padding: "0.6rem 1rem" }}
              >
                Sign in
              </button>

              {/* Register link */}
              <p className="text-center text-muted mt-2 mb-0">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="fw-semibold text-decoration-none text-primary"
                >
                  Register for free
                </Link>
              </p>
            </form>
          </div>

          {/* Right side: Image */}
          <div className="col-md-6 d-none d-md-block position-relative">
            <img
              src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?fit=crop&w=900&q=80"
              alt="Car background"
              className="w-100 h-100 object-fit-cover"
            />
            <div className="position-absolute bottom-0 end-0 m-4 p-3 bg-dark bg-opacity-50 text-white rounded-3 shadow-sm">
              <p className="mb-0 fst-italic small">
                “We've been using ZipDrive to get our trips organized and it's
                been a lifesaver.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
