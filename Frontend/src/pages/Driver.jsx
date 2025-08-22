// Frontend/src/pages/Driver.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Placeholder, WhiteLogo } from "../assets/images/Images";
import "../assets/styles/Home.css";
import UpdateUserDetails from "../components/UpdateUserDetails";
import Map from "../components/Map";
import DriverSideBar from "../components/DriverSideBar";
import DriverBottom from "../components/DriverBottom";

const Driver = () => {
  const { userData } = useAuth();
  const [searching, setSearching] = useState(false);
  const [isProfileDetails, setIsProfileDetails] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stopLocation, setStopLocation] = useState("");
const [isAvailable, setIsAvailable] = useState(
  JSON.parse(localStorage.getItem("isAvailable")) || false
);

useEffect(() => {
  localStorage.setItem("isAvailable", JSON.stringify(isAvailable));
}, [isAvailable]);

// if(location){
//   alert("Location permision denied please enable location permision");
// }

console.log(isAvailable);
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
        {!isAvailable && (
          <DriverSideBar
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            setSearching={setSearching}
            setLocationType={setLocationType}
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
        {isAvailable && (
          <DriverBottom
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            startLocation={startLocation}
            setIsSearching={setSearching}
          />
        )}
      </div>
      {isProfileDetails && (
        <UpdateUserDetails setIsProfileDetails={setIsProfileDetails} />
      )}
    </div>
  );
};

export default Driver;
