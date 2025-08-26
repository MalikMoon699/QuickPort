import React, { useState } from "react";
import "../assets/styles/Request.css";
import { Placeholder, Car, Bike, Auto } from "../assets/images/Images";
import { toast } from "react-toastify";

const Request = ({ setIsRequest }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDetailModel, setIsDetailModel] = useState(false);

  const rideData = {
    riderData: {
      //   _id: objectId("68a763cb8ee80c6fde04d379"),
      _id: "68a763cb8ee80c6fde04d379",
      email: "malikmoon.developer061@gmail.com",
      profileImg: "",
      firstName: "Moon",
      lastName: "Awan",
      phoneNumber: "03123456789",
      gender: "Male",
      role: "rider",
      createdAt: "2025-08-21T18:22:03.115+00:00",
      updatedAt: "2025-08-21T18:22:57.244+00:00",
    },
    driverData: {
      //   id: objectId("68a5d5b2336947d56c9f0d34"),
      id: "68a5d5b2336947d56c9f0d34",
      email: "mujtabamalik0319@gmail.com",
      profileImg: "",
      firstName: "Mujtaba",
      lastName: "Malik",
      phoneNumber: "03123456789",
      gender: "Male",
      CNIC: "34101-2342343423423",
      rideType: "Car",
      rideNumber: "CT 1289",
      rideBrand: "Alto",
      role: "driver",
      createdAt: "2025-08-20T14:03:30.145+00:00",
      updatedAt: "2025-08-22T12:56:56.100+00:00",
    },
    rideDetails: {
      locations: {
        start:
          "697, Umer Block Umar Block Allama Iqbal Town, Lahore, 54000, Pakistan",
        stop: "Ichra Rd, Ichhra Shah Din Scheme Lahore, 54000, Pakistan",
        end: "2 Gulberg Rd, Millat Colony, Lahore, 54600, Pakistan",
        totalDistance: "4km",
        riderlocation:
          "697, Umer Block Umar Block Allama Iqbal Town, Lahore, 54000, Pakistan",
        driverlocation:
          "Shop #02 Fazal e Haq Rd, Ravi Block Allama Iqbal Town, Lahore, Pakistan",
      },
      Time: "now",
    },
    price: "350",
    driverStatus: "pending",
    riderStatus: "pending",
    rideStatus: "pending",
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsRequest(false), 800);
  };

  const handleReject = () => {
    handleClose();
    toast.success("Ride rejected");
  };
  const handleAccept = () => {
    handleClose();
    toast.success("Ride accepted");
  };

  console.log("rideData-->", rideData);
  return (
    <>
      <div
        className={`request-container ${
          isVisible ? "fade-in-left" : "fade-in-right"
        }`}
      >
        <div className="request-driver-details">
          <img src={rideData?.driverData?.profileImg || Placeholder} />
          <div>
            <p>
              {rideData?.driverData?.firstName} {rideData?.driverData?.lastName}
            </p>
            <p>{rideData?.driverData?.phoneNumber}</p>
          </div>
          <button
            onClick={() => {
              setIsDetailModel(true);
            }}
          >
            Details
          </button>
        </div>
        <div className="request-ride-details">
          <img
            style={{
              margin:
                rideData?.driverData?.rideType === "Car"
                  ? "-35px 0px 0px 0px"
                  : rideData?.driverData?.rideType === "Bike"
                  ? "-10px 0px -15px 0px"
                  : "-10px 0px -15px 0px",
            }}
            src={
              rideData?.driverData?.rideType === "Car"
                ? Car
                : rideData?.driverData?.rideType === "Bike"
                ? Bike
                : Auto
            }
          />
          <div>
            <p>{rideData?.driverData?.rideNumber}</p>
            <p>
              <strong>Ride:</strong> {rideData?.driverData?.rideBrand}
            </p>
          </div>
        </div>
        <div className="request-details2">
          <p>
            <strong>Total Distance:</strong>{" "}
            {rideData?.rideDetails?.locations?.totalDistance}
          </p>
          <h2>
            Price: {rideData?.price}
            <span style={{ fontSize: "17px", fontWeight: "600" }}>Pkr</span>
          </h2>
        </div>
        <div className="request-action">
          <button onClick={handleReject}>Reject</button>
          <button onClick={handleAccept}>Accept</button>
        </div>
      </div>
      {isDetailModel && (
        <div
          onClick={() => {
            setIsDetailModel(false);
          }}
          className="modal-overlay"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="modal-content"
            style={{ padding: "0px" }}
          >
            <div className="modal-header-2">
              <button
                onClick={() => {
                  setIsDetailModel(false);
                }}
                className="modal-back-btn modal-back-btn-2"
              >
                ❮
              </button>
              <p className="modal-title">Request Details</p>
            </div>
            <div className="modal-body">
              <div className="modal-body-user-container">
                <img
                  src={rideData?.driverData?.profileImg || Placeholder}
                  alt=""
                />
                <div>
                  <p>
                    {rideData?.driverData?.firstName}{" "}
                    {rideData?.driverData?.lastName}
                  </p>
                  <p>{rideData?.driverData?.phoneNumber}</p>
                  <p>{rideData?.driverData?.email}</p>
                </div>
              </div>
              <div className="modal-body-driver-rideinfo-container">
                <img
                  style={{
                    // border:"none",
                    margin:
                      rideData?.driverData?.rideType === "Car"
                        ? "0px 0px 0px 0px"
                        : rideData?.driverData?.rideType === "Bike"
                        ? "-10px 0px -15px 0px"
                        : "-10px 0px -15px 0px",
                  }}
                  src={
                    rideData?.driverData?.rideType === "Car"
                      ? Car
                      : rideData?.driverData?.rideType === "Bike"
                      ? Bike
                      : Auto
                  }
                  alt=""
                />
                <div>
                  <p>
                    <strong>Ride:</strong> {rideData?.driverData?.rideBrand}
                  </p>
                  <p>
                    {" "}
                    <strong>Ride Time:</strong> {rideData?.rideDetails?.Time}
                  </p>
                  <p>
                    {" "}
                    <strong>Ride Number:</strong>{" "}
                    {rideData?.driverData?.rideNumber}
                  </p>
                </div>
              </div>
              <div
                className="modal-body-location-container"
              >
                <p>
                  <strong> Rider location:</strong>
                  {rideData?.rideDetails?.locations?.riderlocation}
                </p>
                <p>
                  <strong>Start location:</strong>
                  {rideData?.rideDetails?.locations?.start}
                </p>
                <p>
                  <strong> Stop location:</strong>
                  {rideData?.rideDetails?.locations?.stop}
                </p>
                <p>
                  <strong>End location:</strong>
                  {rideData?.rideDetails?.locations?.riderlocation}
                </p>
                <p>
                  <strong>Total Distance:</strong>
                  {rideData?.rideDetails?.locations?.totalDistance}
                </p>
              </div>
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

export default Request;
