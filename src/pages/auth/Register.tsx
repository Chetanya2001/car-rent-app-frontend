import { Link } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { UserRegister } from "../../types/user";
import { registerUser } from "../../services/auth";
import InputField from "../../components/InputField";

const ROLE_OPTIONS: UserRegister["role"][] = ["guest", "host"];

export default function Register() {
  const [formData, setFormData] = useState<UserRegister>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "guest",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      console.log("User registered:", data);
      // TODO: redirect to login/dashboard
    } catch (error: any) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <div className="row g-0">
          {/* Form Section */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center bg-white">
            <h2 className="fw-bold mb-3 display-6">Create Account</h2>
            <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
              Enter your details below to create a new account.
            </p>

            <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
              {/* First & Last Name Side by Side */}
              <div className="d-flex gap-2">
                <div className="flex-grow-1">
                  <InputField
                    label="First Name"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-grow-1">
                  <InputField
                    label="Last Name"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />

              {/* Phone */}
              <InputField
                label="Phone"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />

              {/* Password */}
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              {/* Role Selection */}
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="form-label fw-semibold small text-uppercase text-secondary mb-1"
                >
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  className="form-select shadow-sm"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    borderRadius: "0.5rem",
                    padding: "0.55rem 0.75rem",
                    fontSize: "0.95rem",
                  }}
                  required
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold shadow"
                style={{
                  padding: "0.65rem 1rem",
                  fontSize: "0.95rem",
                  borderRadius: "0.6rem",
                  transition: "all 0.3s",
                }}
              >
                Register
              </button>

              <p
                className="text-center text-muted mt-3 mb-0"
                style={{ fontSize: "0.9rem" }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-decoration-none text-primary fw-semibold"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* Image Section */}
          <div className="col-md-6 d-none d-md-block position-relative">
            <img
              src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?fit=crop&w=900&q=80"
              alt="Car background"
              className="w-100 h-100 object-fit-cover"
            />
            <div className="position-absolute bottom-0 start-0 p-4 bg-dark bg-opacity-50 text-white rounded-3 shadow-sm m-4">
              <p className="mb-0 fst-italic" style={{ fontSize: "0.9rem" }}>
                “Join us and experience a seamless car rental journey with ease
                and reliability.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
