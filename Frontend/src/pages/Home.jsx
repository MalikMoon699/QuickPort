// Frontend/src/pages/Home.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Placeholder, WhiteLogo } from "../assets/images/Images";
import "../assets/styles/Home.css";
import UpdateUserDetails from "../components/UpdateUserDetails";

const Home = () => {
  const { userData, logout } = useAuth();
  const email = userData?.email || "guest";
  const [isProfileDetails, setIsProfileDetails] = useState(false);

  return (
    <div className="home-container">
      <div className="auth-header">
        <div>
          <img src={WhiteLogo} alt="logo" />
          <span>QuickPort</span>
        </div>
        <div
          className="header-user-info"
          onClick={() => setIsProfileDetails(true)}
        >
          <div>
            <img src={userData.profileImg || Placeholder} />
            <span>{userData.firstName || "Guest"}</span>
          </div>
          <span>❮</span>
        </div>
      </div>
      <h1>Welcome to QuickPort, {email}</h1>
      {userData?.firstName && (
        <p>
          Name: {userData.firstName} {userData.lastName}
        </p>
      )}
      <button onClick={logout}>logout</button>
      {isProfileDetails && (
        <UpdateUserDetails setIsProfileDetails={setIsProfileDetails} />
      )}
    </div>
  );
};

export default Home;
