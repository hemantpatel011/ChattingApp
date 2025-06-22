import React, { useState, useEffect, useRef } from "react";
import photo from "../assets/chatappLogo.jpg";
import socket from "../config/socket";
import backend from "../config/api";
import { useAuth } from "../context/authContext";

const Chatting = ({ reciver }) => {
  const chatID = reciver || null;
  const { user } = useAuth();
  const [receiver, setReceiver] = useState(null);
  const [sendMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handelSendMessage = async () => {
    if (sendMessage.trim() === "" || !chatID || !user?.id) return;

    try {
      const newMessage = {
        sender: user.id,
        message: sendMessage,
        createdAt: new Date(),
        isSender: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setSendMessage("");


      socket.emit("private_message", {
        from: user.id,
        to: chatID,
        message: sendMessage,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const getCurrentUser = async () => {
    try {
      if (!chatID) return;
      const res = await backend.get(`/user/getRecentUser/${chatID}`);
      setReceiver(res.data.receiver);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const getMessages = async () => {
    try {
      if (!chatID) return;
      const res = await backend.post(`/user/receive/${chatID}`);
      const formattedMessages = res.data.data.map(msg => ({
        ...msg,
        isSender: msg.sender === user.id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getMessages();

    if (user?.id) {
      socket.emit("register", user.id);
    }

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: msg.from,
          message: msg.message,
          createdAt: new Date(msg.createdAt),
          isSender: false,
        },
      ]);
    };

    socket.on("user_list", setOnlineUsers);
    socket.on("receive_private_message", handleReceiveMessage);

    return () => {
      socket.off("user_list", setOnlineUsers);
      socket.off("receive_private_message", handleReceiveMessage);
      if (user?.id) {
        socket.emit("unregister", user.id);
      }
    };
  }, [chatID, user?.id]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handelSendMessage();
    }
  };

  return (
    <div className="w-3/4 h-full bg-green-200 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-4 border-b pb-4">
        <img
          src={receiver?.profilePicture || photo}
          alt=""
          className="w-8 h-8 object-cover rounded-full"
        />
        <h2 className="text-2xl font-bold text-[#1A3C5A]">
          {receiver?.fullName || "Welcome to ChatApp"}
          {onlineUsers.includes(chatID) && (
            <span className="ml-2 text-xs text-green-600">• Online</span>
          )}
        </h2>
      </div>
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div className="flex-1 w-full overflow-y-auto p-4 bg-green-50 rounded min-h-0 scrollbar-hide">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isSender
                    ? "bg-[#FF4081] text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-4 mt-4 p-2 bg-white rounded-lg">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF4081] text-[#1A3C5A]"
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-4 py-2 bg-[#FF4081] text-white rounded-lg hover:bg-[#FF4081]/90 transition-colors disabled:opacity-50"
            onClick={handelSendMessage}
            disabled={!sendMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;