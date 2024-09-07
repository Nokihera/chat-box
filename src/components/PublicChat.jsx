// import React, { useEffect, useRef, useState } from "react";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
// } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { app, db } from "../api/firebase"; // Import your Firestore instance

// const PublicChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null); // Ref to the end of the messages
//   const auth = getAuth(app);
//   const currentUser = auth.currentUser;
//   const uid = currentUser?.uid; // Handle case if user is not logged in
//   const displayName = currentUser?.displayName || "Anonymous"; // Handle case if user is not logged in

//   // Fetch messages in real-time from Firestore
//   useEffect(() => {
//     const messagesCollection = collection(db, "messages");
//     const q = query(messagesCollection, orderBy("timestamp", "asc"));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const fetchedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(fetchedMessages);
//     });

//     // Cleanup listener on component unmount
//     return () => unsubscribe();
//   }, []);

//   // Scroll to the bottom of the messages area
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]); // Run effect when messages change

//   // Send a message to Firestore
//   const handleSendMessage = async () => {
//     if (!uid || newMessage.trim() === "") return;

//     try {
//       const messagesCollection = collection(db, "messages");
//       await addDoc(messagesCollection, {
//         uid: uid,
//         user: displayName, // Replace with actual username or userID
//         text: newMessage,
//         timestamp: serverTimestamp(), // Use Firestore server timestamp
//       });
//       setNewMessage(""); // Clear input after sending
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   // Format timestamp to a readable format
//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate();
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100 p-4">
//       {/* Chat Header */}
//       <div className="bg-gray-800 text-white py-2 px-4 rounded-t-lg shadow-md">
//         <h2 className="text-lg font-semibold">Public Chat Room</h2>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-grow overflow-y-auto p-4 bg-white shadow-inner rounded-lg space-y-4 public-chat-box">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex items-start ${
//               message.uid === uid ? "justify-end" : "justify-start"
//             }`}
//           >
//             <div
//               className={`flex flex-col space-y-1 p-3 rounded-lg ${
//                 message.uid === uid ? "bg-blue-100" : "bg-gray-200"
//               }`}
//             >
//               <div className="text-sm font-semibold">{message.user}</div>
//               <div className="text-sm">{message.text}</div>
//               <div className="text-xs text-gray-500">
//                 {formatTimestamp(message.timestamp)}
//               </div>
//             </div>
//           </div>
//         ))}
//         {/* Empty div to help scroll to the bottom */}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="flex items-center space-x-2 mt-4">
//         <input
//           type="text"
//           className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           onClick={handleSendMessage}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PublicChat;
