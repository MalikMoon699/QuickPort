import React, { useState } from "react";
import "../assets/styles/Request.css";
import { Placeholder } from "../assets/images/Images";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const DriverRequest = ({ setIsRequest, incomingRide }) => {
  const { userData } = useAuth();
  const socket = useSocket();
  const [isVisible, setIsVisible] = useState(true);
  const [isDetailModel, setIsDetailModel] = useState(false);
  const [ridePrice, setRidePrice] = useState(350);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsRequest(false), 800);
  };

  const handleReject = () => {
    if (socket && incomingRide) {
      socket.emit("reject-ride", incomingRide._id, userData._id);
    }
    handleClose();
    toast.success("Ride rejected");
  };

  const handleAccept = () => {
    if (socket && incomingRide) {
      socket.emit(
        "accept-ride",
        incomingRide._id,
        userData,
        ridePrice.toString()
      );
    }
    handleClose();
    toast.success("Ride accepted");
  };

  const handleIncrease = () => {
    setRidePrice((prev) => prev + 10);
  };

  const handleDecrease = () => {
    setRidePrice((prev) => prev - 10);
  };

  return (
    <>
      <div
        className={`request-container ${
          isVisible ? "fade-in-left" : "fade-in-right"
        }`}
      >
        <div className="request-driver-details">
          <img src={incomingRide?.riderData?.profileImg || Placeholder} />
          <div>
            <p>
              {incomingRide?.riderData?.firstName}{" "}
              {incomingRide?.riderData?.lastName}
            </p>
            <p>{incomingRide?.riderData?.phoneNumber}</p>
          </div>
          <button onClick={() => setIsDetailModel(true)}>Details</button>
        </div>
        <div className="request-details2">
          <p style={{ marginTop: "10px" }}>
            <strong>Time:</strong> {incomingRide?.rideDetails?.Time}
          </p>
          <p>
            <strong>Total Distance:</strong>{" "}
            {incomingRide?.rideDetails?.locations?.totalDistance}
          </p>
          <h2 className="price-consolution">
            Price:
            <div>
              <span onClick={handleDecrease}>-10</span>
              <input
                type="text"
                value={ridePrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setRidePrice(value);
                  }
                }}
              />
              <span onClick={handleIncrease}>+10</span>
            </div>
            <span style={{ fontSize: "17px", fontWeight: "600" }}> Pkr</span>
          </h2>
        </div>
        <div className="request-action">
          <button onClick={handleReject}>Reject</button>
          <button onClick={handleAccept}>Accept</button>
        </div>
      </div>
      {isDetailModel && (
        <div onClick={() => setIsDetailModel(false)} className="modal-overlay">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
            style={{ padding: "0px" }}
          >
            <div className="modal-header-2">
              <button
                onClick={() => setIsDetailModel(false)}
                className="modal-back-btn modal-back-btn-2"
              >
                ❮
              </button>
              <p className="modal-title">Request Details</p>
            </div>
            <div className="modal-body">
              <div className="modal-body-user-container">
                <img
                  src={incomingRide?.riderData?.profileImg || Placeholder}
                  alt=""
                />
                <div>
                  <p>
                    {incomingRide?.riderData?.firstName}{" "}
                    {incomingRide?.riderData?.lastName}
                  </p>
                  <p>{incomingRide?.riderData?.phoneNumber}</p>
                  <p>{incomingRide?.riderData?.email}</p>
                </div>
              </div>
              <div className="modal-body-location-container">
                <p>
                  <strong>Rider location:</strong>
                  {incomingRide?.rideDetails?.locations?.riderlocation}
                </p>
                <p>
                  <strong>Start location:</strong>
                  {incomingRide?.rideDetails?.locations?.start}
                </p>
                <p>
                  <strong>Stop location:</strong>
                  {incomingRide?.rideDetails?.locations?.stop}
                </p>
                <p>
                  <strong>End location:</strong>
                  {incomingRide?.rideDetails?.locations?.end}
                </p>
                <p>
                  <strong>Total Distance:</strong>
                  {incomingRide?.rideDetails?.locations?.totalDistance}
                </p>
              </div>
              <h2 className="price-consolution">
                Price:
                <div>
                  <span onClick={handleDecrease}>-10</span>
                  <input
                    type="text"
                    value={ridePrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setRidePrice(value);
                      }
                    }}
                  />
                  <span onClick={handleIncrease}>+10</span>
                </div>
                <span style={{ fontSize: "17px", fontWeight: "600" }}>
                  {" "}
                  Pkr
                </span>
              </h2>
              <div className="request-action">
                <button onClick={handleReject}>Reject</button>
                <button onClick={handleAccept}>Accept</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverRequest;
