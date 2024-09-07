import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/firebase';

const Settings = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  }, []);
  return (
    <div>Settings</div>
  )
}

export default Settings