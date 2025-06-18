import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../config/api";
import toast from "react-hot-toast";
//import { state } from "../../public/dummy";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    cfPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target; // const name = e.target.name;
    // const value = e.target.value;        shorter way to write instead of these 2 lines

    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Registered Data:", registerData);

    try{
      const res = await backend.post ("/auth/register", registerData);
      console.log("Response:", res.data);
      toast.success(res.data.message);
    }catch (error) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className="h-full p-10 flex items-center justify-center ">
        <div className="w-full max-w-lg min-h-fit bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col gap-8">
          <h1 className="text-4xl font-bold text-[#1A3C5A] text-center mb-2">
            Register
          </h1>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex items-center gap-5 ">
              <label className="min-w-fit text-lg font-semibold text-[#1A3C5A] mb-1">
                Full Name:
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-7">
              <label
                htmlFor="email"
                className="min-w-fit text-lg font-semibold text-[#1a3c5a] mb-1"
              >
                Email:
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-8">
              <label
                htmlFor="Password"
                className="min-w-fit text-lg font-semibold text-[#1A3C5A] mb-1"
              >
                Password:
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
                onChange={handleChange}
              ></input>
            </div>

            <div className="flex items-center gap-8">
              <label
                htmlFor="cfPassword"
                className="min-w-fit text-lg font-semibold text-[#1A3C5A] mb-1"
              >
                Confirm <br /> Password:
              </label>
              <input
                type="password"
                name="cfPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
                onChange={handleChange}
              ></input>
            </div>

            <button
              type="createAccount"
              className="w-full py-3 bg-[#1A3C5A] text-white font-bold rounded-lg hover:bg-[#FF4081] transition-colors duration-200"
            >
              Create Account
            </button>

          </form>

          <div className="text-center mt-2">
            <button
              className="text-[#FF4081] hover:underline font-semibold"
              onClick={() => navigate("/Login")}
            >
              Already have an account? / Login Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
