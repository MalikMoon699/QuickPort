// Frontend/src/components/SignupDetails.jsx
import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/SignupDetails.css";
import { Placeholder } from "../assets/images/Images";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const SignupDetails = () => {
  const navigate = useNavigate();
  const { userData, logout, setUserData } = useAuth();
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState(userData?.profileImg || "");
  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
  const [cnicNumber, setCNICNumber] = useState(userData?.cnicNumber || "");
  const [gender, setGender] = useState(userData?.gender || "Gender");
  const [rideType, setRideType] = useState(userData?.rideType || "RideType");
  const [rideNumber, setRideNumber] = useState(userData?.rideNumber || "");
  const [rideBrand, setRideBrand] = useState(userData?.rideBrand || "");
  const [loading, setLoading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current.click(); 
  };


  const validation = () => {
    if (!firstName || !lastName || !phoneNumber) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (
      userData?.role !== "rider" &&
      (!cnicNumber || rideType === "RideType")
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (rideType !== "RideType" && (!rideNumber || !rideBrand)) {
      toast.error(`Please fill in ${rideType} Number and Brand.`);
      return false;
    }
    return true;
  };

const handleSave = async () => {
  if (!validation()) return;
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("cnicNumber", cnicNumber);
    formData.append("gender", gender);
    formData.append("rideType", rideType);
    formData.append("rideNumber", rideNumber);
    formData.append("rideBrand", rideBrand);
    if (profileImg instanceof File) {
      formData.append("profileImg", profileImg);
    }

    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/update`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await res.json();
    console.log("Profile updated:", data);
    toast.success("Profile updated successfully!");
    setUserData((prev) => ({ ...prev, ...data.user }));
    navigate("/");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile");
  } finally {
    setLoading(false);
  }
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setProfileImg(file);
    const previewUrl = URL.createObjectURL(file);
    setProfileImg(previewUrl);
  }
};


  return (
    <div className="signup-details-container">
      <h1 className="signup-details-title">Your Details</h1>
      <div className="signup-profile-image-container">
        <img
          src={profileImg || Placeholder}
          alt="profile"
          onClick={handleImageClick}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            width: 120,
            height: 120,
          }}
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      {userData?.role === "rider" ? (
        <>
          <div className="signup-details-inputs">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div className="signup-details-inputs">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
            <select
              style={{
                color: gender === "Gender" ? "rgb(0 0 0 / 38%)" : "black",
              }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Gender" disabled>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="signup-details-inputs">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
          <div className="signup-details-inputs">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={cnicNumber}
              onChange={(e) => setCNICNumber(e.target.value)}
              placeholder="CNIC Number"
            />
          </div>
          <div className="signup-details-inputs">
            <select
              style={{
                color: gender === "Gender" ? "rgb(0 0 0 / 38%)" : "black",
              }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Gender" disabled>
                Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              style={{
                color: rideType === "RideType" ? "rgb(0 0 0 / 38%)" : "black",
              }}
              value={rideType}
              onChange={(e) => setRideType(e.target.value)}
            >
              <option value="RideType" disabled>
                Ride Type
              </option>
              <option value="Auto">Auto</option>
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
            </select>
          </div>
          {rideType !== "RideType" && (
            <div className="signup-details-inputs">
              <input
                type="tel"
                value={rideNumber}
                placeholder={`${rideType} Number`}
                onChange={(e) => setRideNumber(e.target.value)}
              />
              <input
                type="text"
                value={rideBrand}
                placeholder={`${rideType} Brand`}
                onChange={(e) => setRideBrand(e.target.value)}
              />
            </div>
          )}
        </>
      )}
      <div className="signup-details-btn-container">
        <button onClick={logout}>Logout</button>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SignupDetails;
