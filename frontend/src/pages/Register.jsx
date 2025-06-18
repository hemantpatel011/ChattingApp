import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../config/api";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    cfPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registered Data:", registerData);

    if (registerData.password !== registerData.cfPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const res = await backend.post("/auth/register", registerData);
      console.log("Response:", res.data);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="w-full max-w-md p-8 border rounded-md shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#1A3C5A]">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium text-[#1A3C5A]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={registerData.fullName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              placeholder="Hemant Patel"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1A3C5A]">Email</label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1A3C5A]">Password</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#1A3C5A]">Confirm Password</label>
            <input
              type="password"
              name="cfPassword"
              value={registerData.cfPassword}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => navigate("/login")}
          >
            Login Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
