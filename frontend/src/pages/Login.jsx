import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", loginData);

    try {
      const res = await backend.post("/auth/login", loginData);
      console.log("Response:", res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsLogin(true);
      toast.success(res.data.message);
      navigate("/chat");
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="relative  min-h-screen bg-white text-black flex items-center justify-center px-6">
      <div className="w-full max-w-md p-8 border rounded-md shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememMe"
              className="h-4 w-4 accent-blue-500"
            />
            <label htmlFor="rememMe" className="text-sm text-gray-600">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Not Registered?{" "}
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => navigate("/Register")}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
