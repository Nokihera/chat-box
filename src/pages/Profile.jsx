import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import Preloader from "../components/Preloader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/sign-in");
      } else {
        setUser(user);
        setLoading(false);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Preloader/>; // Display loading message while checking auth status
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Link
        to="/"
        className="bg-blue-500 text-white px-3 py-2 hover:bg-white hover:border-blue-500 border-2 hover:text-black border-blue-500 rounded-lg transition-all duration-300 "
      >
        <i className="fa-solid fa-chevron-left"></i> Back
      </Link>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold ">Profile</h1>{" "}
          <Link to={"/edit-profile"} className="bg-blue-500 text-white px-3 py-1 hover:bg-white hover:border-blue-500 border-2 hover:text-black border-blue-500 rounded-lg transition-all duration-300">
            Edit
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-medium">
              {user?.displayName || "Anonymous"}
            </p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
