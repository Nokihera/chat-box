import React, { useEffect, useState } from "react";
import { auth } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import PrivateChat from "../components/PrivateChat";
import Preloader from "../components/Preloader";

const ChatBox = () => {
  const [activeSession, setActiveSession] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    // Listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/sign-in");
      } else {
        setLoading(false); // User is authenticated, stop loading
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const changeActiveBtnClick = () => {
    setActiveSession(!activeSession);
  };

  if (loading) {
    return <Preloader />; // Display loading message while checking auth status
  }

  return (
    <>
      <NavBar
        changeActiveBtnClick={changeActiveBtnClick}
        setActiveSession={setActiveSession}
        activeSession={activeSession}
        setSearch={setSearch}
      />
      <PrivateChat search={search} />
    </>
  );
};

export default ChatBox;
