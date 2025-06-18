import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import backend from "../config/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isLogin, setIsLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    sessionStorage.removeItem("user");
    try {
      const res = await backend.post("/auth/logout");
      console.log("Response:", res.data);
      toast.success(res.data.message);
      setIsLogin(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    // Reload the page to reflect the logout
  };
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            <Link to={"/"}>MyApp</Link>
          </div>
          <div className="space-x-4 flex items-center">
            <Link to={"/about"} className="text-gray-300 hover:text-white">
              About
            </Link>
            <Link to={"/contact"} className="text-gray-300 hover:text-white">
              Contact
            </Link>

            {isLogin ? (
              <div className=" items-center space-x-2 inline-flex gap-2">
                <Link to={"/chat"} className="text-gray-300 hover:text-white">
                  Chat
                </Link>
                <Link to={"/profile"}>
                  <img
                    src={user.profilePicture || null}
                    alt=""
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </Link>

                <button
                  className="text-gray-300 hover:text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to={"/login"} className="text-gray-300 hover:text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
