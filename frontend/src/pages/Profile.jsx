import React, { use, useEffect } from "react";
import photo from "../assets/Steve-jobs.webp";
import { useState } from "react";

const Profile = () => {
  const [data, setData] = useState(
    JSON.parse(sessionStorage.getItem("user")) || {
      name: "Steve Jobs",
      email: "email@example.com",
    }
  );

  const handlePhotoChange = () => {
    // This function can be used to change the profile photo
    // For now, it just logs a message
    console.log("Change photo button clicked");
  };

  const handleChange = (e) => {
    //every time i am writing anything in the input the function is called and everything is stored
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value })); //...prev thing
  };
  return (
    <>
      <div className="h-[90vh] p-10 flex items-center justify-center flex-col bg-gray-100">
        <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col gap-8">
          <h1 className="text-4xl font-bold text-[#1A3C5A] text-center mb-2">
            Profile
          </h1>
          <div className="flex items-center justify-center">
            <img
              src={data.profilePicture || photo}
              alt="profilepicture"
              className="w-50 h-50 object-cover border rounded-full"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="text-center text-2xl border-b-2 border-gray-300 focus:outline-none focus:border-[#FF4081] bg-transparent"
            />

            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="text-center text-2xl border-b-2 border-gray-300 focus:outline-none focus:border-[#FF4081] bg-transparent"
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="w-full py-3 bg-white border border-[#1A3C5A] text-[#1A3C5A] font-bold rounded-lg hover:bg-[#FF4081] hover:text-white transition-colors duration-200"
              onClick={handlePhotoChange}
            >
              Change Photo
            </button>
            <button
              type="button"
              className="w-full py-3 bg-[#1A3C5A] text-white font-bold rounded-lg hover:bg-[#FF4081] transition-colors duration-200"
              onClick={() => console.log("Data saved:", data)}
            >
              Save Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
