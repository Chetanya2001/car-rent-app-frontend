import { useState, type ChangeEvent, type FormEvent } from "react";
import type { User, UserRegister } from "../../../types/user";
import { registerUser } from "../../../services/auth";

export interface RegisterProps {
  onClose: () => void;
  onSwitch: () => void;
  onRegisterSuccess: (userData: User) => void; // 👈 new prop for switching to Login
}

export default function Register({ onClose, onSwitch }: RegisterProps) {
  const [formData, setFormData] = useState<UserRegister>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "guest", // 👈 default role
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "guest" ? "host" : "guest",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      console.log("User registered:", data);
      onClose();
    } catch (error: any) {
      console.error("Error registering user:", error.message);
    }
  };

  return (
    <div className="register-wrapper">
      <div
        className="card shadow-lg border-0 rounded-4 overflow-hidden"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <div className="row g-0">
          {/* Form Section */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center bg-white">
            <h2 className="fw-bold mb-3 display-6">Create Account</h2>

            {/* Role Toggle Switch 👇 */}
            <div className="mb-4 text-start">
              <label className="form-label fw-semibold text-secondary d-block mb-2">
                Role: {formData.role === "guest" ? "Guest" : "Host"}
              </label>
              <div className="form-check form-switch big-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="roleToggle"
                  checked={formData.role === "host"}
                  onChange={handleRoleToggle}
                />
              </div>
            </div>

            <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="d-flex gap-2">
                <div className="flex-grow-1">
                  <label className="form-label small fw-semibold text-secondary">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-grow-1">
                  <label className="form-label small fw-semibold text-secondary">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="form-label small fw-semibold text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="form-label small fw-semibold text-secondary">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="form-label small fw-semibold text-secondary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold shadow"
              >
                Register
              </button>

              <p className="text-center text-muted mt-3 mb-0">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitch}
                  className="btn btn-link p-0 fw-semibold text-primary text-decoration-none"
                >
                  Login
                </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
