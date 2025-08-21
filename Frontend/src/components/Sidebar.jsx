// Frontend/src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  CalendarDays,
  CircleDot,
  CirclePlus,
  Clock,
  LocateFixed,
  MapPin,
  Menu,
  SquareStop,
  Trash2,
} from "lucide-react";
import PickupTime from "./PickupTime";

const Sidebar = () => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [stopLocation, setStopLocation] = useState("");
  const [isStopAdded, setIsStopAdded] = useState(false);
  const [isPickupTime, setIsPickupTime] = useState(false);
  const [pickupTime, setPickupTime] = useState("now");
  const [pickupDate, setPickupDate] = useState("Today");
  const [pickupSelection, setPickupSelection] = useState("");
  const [pickupSelectionModel, setPickupSelectionModel] = useState(false);

  const handleClear = () => {
    setPickupTime("now");
    setPickupDate("Today");
    setIsPickupTime(false);
  };

  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const dateObj = new Date(pickupDate);
  const shortDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
  return (
    <>
      {!isPickupTime ? (
        <div className="home-sidebar-container">
          <span>Get a ride</span>
          <div className="home-sidebar-inputs">
            <CircleDot size={25} fill="black" color="white" />
            <input
              type="text"
              placeholder="Pickup location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
            {startLocation === "" ? (
              <div className="home-sidebar-inputs-location-options">
                <div>
                  <span>
                    <MapPin />
                  </span>
                  Use current location
                </div>
                <div>
                  <span>
                    <LocateFixed />
                  </span>
                  Set location on map
                </div>
              </div>
            ) : (
              <div className="home-sidebar-inputs-location-options">
                <div>
                  <span>
                    <MapPin />
                  </span>
                  here show list of matches Locations
                </div>
                <div>
                  <span>
                    <LocateFixed />
                  </span>
                  Set location on map
                </div>
              </div>
            )}
          </div>
          {isStopAdded && (
            <div className="home-sidebar-inputs">
              <Menu size={30} color="black" />
              <input
                type="text"
                placeholder="Add Stop"
                value={stopLocation}
                onChange={(e) => setStopLocation(e.target.value)}
              />
              <Trash2
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsStopAdded(false);
                  setStopLocation("");
                }}
                size={35}
              />
            </div>
          )}
          <div className="home-sidebar-inputs">
            <SquareStop size={30} fill="black" color="white" />
            <input
              type="text"
              placeholder="Dropoff location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
            />
            {!isStopAdded && (
              <CirclePlus
                style={{ cursor: "pointer" }}
                onClick={() => setIsStopAdded(true)}
                size={35}
                fill="black"
                color="white"
              />
            )}
          </div>
          <div
            onClick={() => {
              setIsPickupTime(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <Clock size={25} />
            <p>
              pickup{" "}
              {pickupDate === formattedCurrentDate || pickupDate === "Today"
                ? ""
                : shortDate}{" "}
              {pickupDate !== formattedCurrentDate ? pickupTime : "now"}
            </p>
            <span>❮</span>
          </div>
          <div className="search-ride-btn">
            <button
              className={
                startLocation &&
                endLocation &&
                ((isStopAdded && stopLocation) || !isStopAdded)
                  ? "active"
                  : ""
              }
            >
              Search
            </button>
          </div>
        </div>
      ) : (
        <div className="home-sidebar-container">
          <div className="home-sidebar-header-container">
            <button
              onClick={() => {
                setIsPickupTime(false);
              }}
              className="modal-back-btn"
            >
              ❮
            </button>
            <button onClick={handleClear}>clear</button>
          </div>
          <h1 className="home-sidebar-pickup-title">
            When do you want to be picked up?
          </h1>
          <div
            onClick={() => {
              setPickupSelection("date");
              setPickupSelectionModel(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <CalendarDays size={25} />
            <p>{pickupDate === formattedCurrentDate ? "Today" : pickupDate}</p>
            <span>❮</span>
          </div>
          <div
            onClick={() => {
              setPickupSelection("time");
              setPickupSelectionModel(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <Clock size={25} />
            <p>{pickupTime === "00:00" ? "now" : pickupTime}</p>
            <span>❮</span>
          </div>
          <div className="search-ride-btn">
            <button
              onClick={() => {
                setIsPickupTime(false);
              }}
              className="active"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {pickupSelectionModel && (
        <PickupTime
          setPickupSelectionModel={setPickupSelectionModel}
          setPickupSelection={setPickupSelection}
          pickupSelection={pickupSelection}
          setPickupTime={setPickupTime}
          pickupTime={pickupTime}
          setPickupDate={setPickupDate}
          pickupDate={pickupDate}
        />
      )}
    </>
  );
};

export default Sidebar;
