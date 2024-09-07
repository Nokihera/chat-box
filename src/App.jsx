import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ChatBox from "./pages/ChatBox";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import Chat from "./components/Chat";
import PrivateChat from "./components/PrivateChat";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<ChatBox />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/private-chat" element={<PrivateChat />} />
        {/* Dynamic route for Chat component */}
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;
