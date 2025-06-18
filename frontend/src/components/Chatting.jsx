import React, { useState, useEffect } from "react";
import photo from "../assets/chatappLogo.jpg";

import backend from "../config/api";
import { useAuth } from "../context/authContext";

const Chatting = (receiverID) => {
  const chatID = receiverID.reciver || null;

  const { user } = useAuth(); // Assuming you have a user context to get the current user

  const [receiver, setReceiver] = useState(null);

  const [sendMessage, setSendMessage] = useState("");

  const handelSendMessage = async () => {
    if (sendMessage.trim() === "") return; // Prevent sending empty messages
    console.log("Message sent:", sendMessage);
    try {
      if (!chatID) {
        console.error("Chat ID is not provided");
        return;
      }

      const res = await backend.post(`/user/send/${chatID}&${sendMessage}`);
      setSendMessage("");
      getMessages();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    // Clear the input after sending
  };

  const getCurrentUser = async () => {
    try {
      if (!chatID) {
        console.error("Chat ID is not provided");
        return;
      }

      const res = await backend.get(`/user/getRecentUser/${chatID}`);
      console.log("Current user data:", res.data.receiver);
      setReceiver(res.data.receiver);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const [message, setMessage] = useState([]);
  const getMessages = async () => {
    try {
      if (!chatID) {
        console.error("Chat ID is not provided");
        return;
      }

      const res = await backend.post(`/user/receive/${chatID}`);
      console.log("Messages data:", res.data.data);
      setMessage(res.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    getCurrentUser();
    getMessages();
  }, [chatID]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 1000); // Fetch messages every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  });

  return (
    <>
      <div className="w-3/4 h-full bg-green-200 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-4 border-b pb-4">
          <img
            src={receiver?.profilePicture || photo}
            alt=""
            className="w-8 h-8 object-cover rounded-full"
          />
          <h2 className="text-2xl font-bold text-[#1A3C5A]">
            {receiver?.fullName || "Welcome to ChatApp"}
          </h2>
        </div>
        {chatID ? (
          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div className="flex-1 w-full overflow-y-auto p-4 bg-green-50 rounded min-h-0">
              {message.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.sender === user.id ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      msg.sender === user.id
                        ? "bg-white text-[#1A3C5A]"
                        : "bg-[#FF4081] text-white"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A] bg-white"
                value={sendMessage}
                onChange={(event) => {
                  setSendMessage(event.target.value);
                }}
              />
              <button
                className="px-4 py-2 bg-[#FF4081] text-white rounded-lg hover:bg-[#FF4081]/90 transition-colors"
                onClick={handelSendMessage}
              >
                Send Message
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatting;
