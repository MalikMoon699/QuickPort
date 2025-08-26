// Frontend/src/pages/Home.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Placeholder, WhiteLogo } from "../assets/images/Images";
import "../assets/styles/Home.css";
import UpdateUserDetails from "../components/UpdateUserDetails";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Bottom from "../components/Bottom";
import Request from "../components/Request";

const Rider = () => {
  const { userData } = useAuth();
  const [isRequest, setIsRequest] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileDetails, setIsProfileDetails] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stopLocation, setStopLocation] = useState("");

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
        {!isSearching && (
          <Sidebar
            setLocationType={setLocationType}
            setIsSearching={setIsSearching}
            locationType={locationType}
            startLocation={startLocation}
            setStartLocation={setStartLocation}
            endLocation={endLocation}
            setEndLocation={setEndLocation}
            stopLocation={stopLocation}
            setStopLocation={setStopLocation}
          />
        )}
        <Map
          setLocationType={setLocationType}
          locationType={locationType}
          startLocation={startLocation}
          setStartLocation={setStartLocation}
          endLocation={endLocation}
          setEndLocation={setEndLocation}
          stopLocation={stopLocation}
          setStopLocation={setStopLocation}
        />
        {isSearching && (
          <Bottom
            setIsSearching={setIsSearching}
            startLocation={startLocation}
            stopLocation={stopLocation}
            endLocation={endLocation}
          />
        )}
        <button
          onClick={() => {
            setIsRequest(true);
          }}
        >
          open
        </button>
        {isRequest && (
          <Request setIsRequest={setIsRequest} isRequest={isRequest} />
        )}
      </div>
      {isProfileDetails && (
        <UpdateUserDetails setIsProfileDetails={setIsProfileDetails} />
      )}
    </div>
  );
};

export default Rider;
