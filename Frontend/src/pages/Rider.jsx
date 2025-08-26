// Frontend/src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Placeholder, WhiteLogo } from "../assets/images/Images";
import "../assets/styles/Home.css";
import UpdateUserDetails from "../components/UpdateUserDetails";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import Bottom from "../components/Bottom";
import Request from "../components/Request";
import { useE } from "react";

const Rider = () => {
  const { userData } = useAuth();
  const socket = useSocket();
  const [pickupTime, setPickupTime] = useState("now");
  const [rideRequestSent, setRideRequestSent] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isProfileDetails, setIsProfileDetails] = useState(false);
  const [locationType, setLocationType] = useState(null);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stopLocation, setStopLocation] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("ride-request-sent", (rideData) => {
        console.log("Ride request sent successfully", rideData);
        setRideRequestSent(true);
      });

      socket.on("ride-request-error", (error) => {
        console.error("Ride request failed", error);
      });

      socket.on("ride-accepted", (rideData) => {
        setIsRequest(true);
        console.log("Ride accepted by driver", rideData);
      });

      return () => {
        socket.off("ride-request-sent");
        socket.off("ride-request-error");
        socket.off("ride-accepted");
      };
    }
  }, [socket]);

  const handleSearch = async () => {
    const rideData = {
      riderData: userData,
      rideDetails: {
        locations: {
          start: startLocation,
          stop: stopLocation,
          end: endLocation,
          totalDistance: "4km",
          riderlocation: startLocation,
          driverlocation: "",
        },
        Time: pickupTime === "now" ? "now" : `${pickupDate} ${pickupTime}`,
      },
      price: "",
      driverStatus: "pending",
      riderStatus: "pending",
      rideStatus: "pending",
    };

    if (socket) {
      socket.emit("ride-request", rideData);
    }

    return rideData;
  };

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
            setPickupTime={setPickupTime}
            pickupTime={pickupTime}
            handleSearch={handleSearch}
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
