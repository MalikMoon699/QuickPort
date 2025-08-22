import React, { useState } from "react";
import Loader from "./Loader";

const DriverBottom = ({
  setIsSearching,
  startLocation,
  setIsAvailable,
  isAvailable,
}) => {
  const [bottom, setBottom] = useState(true);
  const [ellipsis, setEllipsis] = useState(null);

  const EllipsisFunction = (id) => {
    setEllipsis((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="bottom-container"
      style={bottom ? { bottom: "0" } : { bottom: "-325px" }}
    >
      <div className="bottom-inner-container">
        <div className="searching-loader-container">
          <Loader
            loaderType="wave"
            loading={true}
            color="black"
            size="220"
            speed="2.5"
          />
          <h1>Searching...</h1>
        </div>
        <div className="location-container">
          <span
            style={{ whiteSpace: ellipsis === "start" ? "unset" : "nowrap" }}
            className="ellipsis"
          >
            <span
              onClick={() => {
                EllipsisFunction("start");
              }}
              className="ellipsis-change"
            >
              ❮
            </span>
            <strong>Your Location: </strong>
            {startLocation || "Fetching location..."}
          </span>
        </div>
        <div className="search-ride-btn">
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
            }}
            onClick={() => {
              setIsSearching(false);
              localStorage.setItem("isAvailable", JSON.stringify(false));
              setIsAvailable(false);
            }}
          >
            Stop Searching
          </button>
        </div>
      </div>
      <button
        onClick={() => setBottom((prev) => !prev)}
        style={
          bottom
            ? {}
            : {
                transform: "rotate(90deg)",
                borderLeft: "1px solid #cccccc",
                borderRight: "0px",
                borderRadius: "8px 0px 0px 8px",
              }
        }
        className="home-bottom-up-down-btn"
      >
        ❮
      </button>
    </div>
  );
};

export default DriverBottom;
