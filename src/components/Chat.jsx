import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../api/firebase";
import { getAuth } from "firebase/auth";

const Chat = () => {
  const { userId: otherUserId } = useParams(); // Get the other user's ID from URL params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State to store the new message
  const db = getFirestore(app); // Initialize Firestore
  const auth = getAuth(app); // Initialize Firebase Auth to get the current user
  const currentUser = auth.currentUser;
  const chatEndRef = useRef(null); // Ref for scrolling to the latest message

  // Generate a unique chatId using the current user's ID and the other user's ID
  const chatId = [currentUser.uid, otherUserId].sort().join("_"); // Sort IDs to ensure uniqueness

  useEffect(() => {
    const messagesCollection = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [db, chatId]);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a new message
  const sendMessage = async () => {
    if (newMessage.trim() === "") return; // Don't send empty messages

    try {
      const messagesCollection = collection(db, `chats/${chatId}/messages`);

      await addDoc(messagesCollection, {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Chat with User Id: {otherUserId}
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-md h-80 overflow-y-auto border border-gray-300">
        {/* Render messages */}
        {messages.length === 0 ? (
          <p className="text-gray-700 text-center">
            No messages yet. Start chatting with User {otherUserId}!
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`flex ${
                  message.senderId === currentUser.uid
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                    message.senderId === currentUser.uid
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 text-right">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </li>
            ))}
            <div ref={chatEndRef} />
          </ul>
        )}
      </div>

      {/* Input field for sending new messages */}
      <div className="mt-4 flex items-center space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress} // Detect Enter key
          placeholder="Type your message here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
