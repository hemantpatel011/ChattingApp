import React, { useState, useEffect } from "react";
import photo from "../assets/Steve-jobs.webp";
import { Link } from "react-router-dom";
import backend from "../config/api";
import Chatting from "../components/Chatting";

const Chat = () => {
  const [chatID, setChatID] = useState(null);
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [recentChats, setRecentChats] = useState([]);

  const handelOpenChat = (id) => {
    setChatID(id);
  };

  const fetchallRecentChats = async () => {
    try {
      const res = await backend.get("/user/getAllUsers");
      setRecentChats(res.data.users);
    } catch (error) {
      console.error("Error fetching recent chats:", error);
    }
  };

  useEffect(() => {
    fetchallRecentChats();
  }, []);

  return (
    <div className="w-full h-[90vh] flex">
      <div className="w-1/4 h-full bg-pink-200 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#1A3C5A] flex items-center gap-2">
            <img
              src={user?.profilePicture || photo}
              alt=""
              className="w-10 h-10 object-cover rounded-full"
            />
            <Link
              to={"/profile"}
              className="text-black hover:text-[#FF4081]/90"
            >
              {user?.name || "User Name"}
            </Link>
          </h2>
        </div>
        <div className="">
          <h3 className="text-lg text-[#ff4081] font-bold">Recent Chats</h3>
        </div>
        {recentChats.map((chat) => (
          <div
            key={chat._id}
            className="relative flex items-center gap-2 p-2 hover:bg-[#FF4081]/10 rounded-lg cursor-pointer mb-2"
            onClick={() => handelOpenChat(chat._id)}
          >
            <img
              src={chat.profilePicture || photo}
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-[#1A3C5A] font-semibold">
                {chat.fullName || chat.name || "Unknown User"}
              </span>
              {chat.lastMessage && (
                <span className="text-gray-500 text-sm">
                  {chat.lastMessage.length > 40
                    ? chat.lastMessage.slice(0, 40) + "..."
                    : chat.lastMessage}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {chatID ? (
        <Chatting reciver={chatID} />
      ) : (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default Chat;