import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../api/firebase";
import Preloader from "../components/Preloader";
import {
  updateProfile,
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // To handle loading state
  const [userData, setUserData] = useState({ displayName: "", email: "" });
  const [newEmail, setNewEmail] = useState(""); // For updating email
  const [newDisplayName, setNewDisplayName] = useState(""); // For updating display name
  const [password, setPassword] = useState(""); // To reauthenticate
  const [message, setMessage] = useState(""); // For feedback messages

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/sign-in");
      } else {
        // Set user data for form fields
        setUserData({
          displayName: user.displayName || "",
          email: user.email || "",
        });
        setNewDisplayName(user.displayName || "");
        setNewEmail(user.email || "");
        setLoading(false); // Stop loading when user data is available
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  // Function to reauthenticate the user
  const reauthenticateUser = async () => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      return false;
    }
  };

  // Function to update profile information (displayName and email)
  const handleProfileUpdate = async () => {
    try {
      const user = auth.currentUser;

      // Reauthenticate before updating email
      if (newEmail !== user.email) {
        const reauthenticated = await reauthenticateUser();
        if (!reauthenticated) return;
      }

      // Update display name
      if (newDisplayName !== user.displayName) {
        await updateProfile(user, { displayName: newDisplayName });
      }

      // Update email after reauthentication
      if (newEmail !== user.email) {
        await updateEmail(user, newEmail);
      }

      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Function to send email verification
  const handleSendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      await sendEmailVerification(user);
      setMessage("Verification email sent.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Function to send password reset email
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, userData.email);
      setMessage("Password reset email sent.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) {
    return <Preloader />; // Display preloader while checking auth status
  }

  return (
    <>
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold ">Edit Profile</h1>
          <Link
            to="/profile"
            className="bg-blue-500 text-white px-3 py-1 hover:bg-white hover:border-blue-500 border-2 hover:text-black border-blue-500 rounded-lg transition-all duration-300 "
          >
            <i className="fa-solid fa-chevron-left"></i> Back
          </Link>
        </div>

        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700"
          >
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="Enter new display name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password (for reauthentication)
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={handleProfileUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
          <button
            onClick={handleSendVerificationEmail}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Verify Email
          </button>
          <button
            onClick={handlePasswordReset}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Reset Password
          </button>
        </div>

        {message && (
          <p className="text-sm text-center text-red-600">{message}</p>
        )}
      </div>
    </>
  );
};

export default EditProfile;
