import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../utils/constants";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const ClientRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    phone: "",
    aadharNumber: "",
    role: ROLES.CLIENT,
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess("");
    setLoading(true);

    try {
      await register(formData);

      setSuccess("Registration successful! You can login now.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === "object") {
        setFieldErrors(err.response.data);
        setError("Please correct the errors in the form.");
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-green-600">
            Client Registration
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Create your client account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded flex gap-2">
              <FaInfoCircle /> {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded flex gap-2">
              <FaCheckCircle /> {success}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="input-field"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input-field"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              className="input-field"
              value={formData.aadharNumber}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-blue-600 font-medium">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistration;
