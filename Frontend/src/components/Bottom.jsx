import React, { useState } from "react";
import Loader from "./Loader";
import "../assets/styles/Bottom.css";

const Bottom = ({
  setIsSearching,
  startLocation,
  stopLocation,
  endLocation,
}) => {
  const [bottom, setBottom] = useState(true);
  const [ellipsis, setEllipsis] = useState(null);

  const EllipsisFunction = (id) => {
    setEllipsis((prev) => (prev === id ? null : id));
  };

  console.log("ellipsis", ellipsis);
  return (
    <div
      className="bottom-container"
      style={bottom ? { bottom: "0" } : { bottom: "-344px" }}
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
              style={{
                transform: ellipsis === "start" ? "rotate(90deg)" : "",
                borderRadius: ellipsis === "start" ? "0px 0px 30px 0px" : "",
              }}
            >
              ❮
            </span>
            <strong> Start From: </strong>
            {startLocation}
          </span>
          {stopLocation && (
            <span
              style={{ whiteSpace: ellipsis === "stop" ? "unset" : "nowrap" }}
              className="ellipsis"
            >
              <span
                onClick={() => {
                  EllipsisFunction("stop");
                }}
                className="ellipsis-change"
                style={{
                  transform: ellipsis === "stop" ? "rotate(90deg)" : "",
                  borderRadius: ellipsis === "stop" ? "0px 0px 30px 0px" : "",
                }}
              >
                ❮
              </span>
              <strong> Stop At: </strong>
              {stopLocation}
            </span>
          )}
          <span
            style={{ whiteSpace: ellipsis === "end" ? "unset" : "nowrap" }}
            className="ellipsis"
          >
            <span
              onClick={() => {
                EllipsisFunction("end");
              }}
              className="ellipsis-change"
              style={{
                transform: ellipsis === "end" ? "rotate(90deg)" : "",
                borderRadius: ellipsis === "end" ? "0px 0px 30px 0px" : "",
              }}
            >
              ❮
            </span>
            <strong> End At: </strong>
            {endLocation}
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

export default Bottom;
