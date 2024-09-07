import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { app } from "../api/firebase";

const PrivateChat = ({ search }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Private Chat Dashboard</h2>
      {loading ? (
        <div className="text-center text-gray-600">
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No users found.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link
                to={`/chat/${user.id}`} // Use backticks for template literal
                className="w-full text-left p-4 flex items-center space-x-4 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                  {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Start a chat with {user.displayName || "this user"}.
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrivateChat;
