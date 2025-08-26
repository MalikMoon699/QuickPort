// Frontend/src/components/DriverRequest.jsx
import React, { useState } from "react";
import "../assets/styles/Request.css";
import { Placeholder} from "../assets/images/Images";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const DriverRequest = ({ setIsRequest ,incomingRide}) => {
   const { userData } = useAuth();
   const socket = useSocket();
  const [isVisible, setIsVisible] = useState(true);
  const [isDetailModel, setIsDetailModel] = useState(false);
  const [ridePrice, setRidePrice] = useState(350);

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
    if (socket && incomingRide) {
      socket.emit(
        "accept-ride",
        incomingRide._id,
        userData,
        ridePrice.toString()
      );
    }
    handleClose();
  };

  const handleIncrease = () => {
    setRidePrice((prev) => prev + 10);
  };
  const handleDecrease = () => {
    setRidePrice((prev) => prev - 10);
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
          <img src={rideData?.riderData?.profileImg || Placeholder} />
          <div>
            <p>
              {rideData?.riderData?.firstName} {rideData?.riderData?.lastName}
            </p>
            <p>{rideData?.riderData?.phoneNumber}</p>
          </div>
          <button
            onClick={() => {
              setIsDetailModel(true);
            }}
          >
            Details
          </button>
        </div>
        <div className="request-details2">
          <p style={{ marginTop: "10px" }}>
            <strong>Time:</strong> {rideData?.rideDetails?.Time}
          </p>
          <p>
            <strong>Total Distance:</strong>{" "}
            {rideData?.rideDetails?.locations?.totalDistance}
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
                  src={rideData?.riderData?.profileImg || Placeholder}
                  alt=""
                />
                <div>
                  <p>
                    {rideData?.riderData?.firstName}{" "}
                    {rideData?.riderData?.lastName}
                  </p>
                  <p>{rideData?.riderData?.phoneNumber}</p>
                  <p>{rideData?.riderData?.email}</p>
                </div>
              </div>
              <div className="modal-body-location-container">
                <p>
                  <strong>Rider location:</strong>
                  {rideData?.rideDetails?.locations?.riderlocation}
                </p>
                <p>
                  <strong>Start location:</strong>
                  {rideData?.rideDetails?.locations?.start}
                </p>
                <p>
                  <strong>Stop location:</strong>
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
