import react, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../config/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "", //way of initializing the name components or input types present in the page
    password: "",
  });

  const handleChange = (e) => {
    //every time i am writing anything in the input the function is called and everything is stored
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value })); //...prev thing
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //stops that specific part of the page from reloading
    console.log("Form submitted:", loginData);

    try {
      const res = await backend.post("/auth/login", loginData);
      console.log("Response:", res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsLogin(true);
      toast.success(res.data.message);
      navigate("/chat"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="h-full p-10 flex items-center justify-center ">
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-[#1A3C5A] text-center mb-2">
          Login
        </h1>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="UserID"
              className="block text-lg font-semibold text-[#1A3C5A] mb-1"
            >
              User ID
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold text-[#1A3C5A] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememMe"
              className="h-4 w-4 accent-[#FF4081]"
            />
            <label htmlFor="rememMe" className="text-sm text-gray-500">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#1A3C5A] text-white font-bold rounded-lg hover:bg-[#FF4081] transition-colors duration-200"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-2">
          <button
            className="text-[#FF4081] hover:underline font-semibold"
            onClick={() => navigate("/Register")}
          >
            Not Registered? / Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
