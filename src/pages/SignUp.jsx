import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import React, { useState } from "react";
import { app } from "../api/firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); 
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state for form validation and Firebase errors
  const auth = getAuth(app);
  const db = getFirestore(app); // Initialize Firestore
  const navigate = useNavigate(); 

  // Handle user sign up, profile update, and Firestore data addition
  const submitBtn = async () => {
    setError("");

    // Validate inputs
    if (!signUpEmail || !password || !displayName) {
      setError("Please fill in all fields.");
      return;
    }
    
    // Password validation (at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create a new user with email and password
      const res = await createUserWithEmailAndPassword(auth, signUpEmail, password);
      
      if (res.user) {
        // Update the user's profile with the display name
        await updateProfile(res.user, { displayName });

        // Add user data to Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email: signUpEmail,
          displayName: displayName
        });

        // Redirect to the sign-in page
        navigate("/sign-in");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            Join Our Community
          </h1>
          <p className="leading-relaxed mt-4">
            Sign up to connect and chat with your friends in real time.
          </p>
        </div>

        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Sign Up
          </h2>

          <div className="relative mb-4">
            <label htmlFor="display-name" className="leading-7 text-sm text-gray-600">
              Display Name
            </label>
            <input
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              id="display-name"
              name="display-name"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              onChange={(e) => setSignUpEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            onClick={submitBtn}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            By signing up, you can send messages with your friends instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
