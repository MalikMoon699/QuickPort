// Frontend/src/pages/Home.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Placeholder, WhiteLogo } from "../assets/images/Images";
import "../assets/styles/Home.css";
import UpdateUserDetails from "../components/UpdateUserDetails";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";

const Home = () => {
  const { userData } = useAuth();
  const [isProfileDetails, setIsProfileDetails] = useState(false);
  const [locationType, setLocationType] = useState(null);

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
      <div className="home-main-container">
        <Sidebar
          setLocationType={setLocationType}
          locationType={locationType}
        />
        <Map />
      </div>
      {isProfileDetails && (
        <UpdateUserDetails setIsProfileDetails={setIsProfileDetails} />
      )}
    </div>
  );
};

export default Home;
