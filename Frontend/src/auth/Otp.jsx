// Frontend/src/auth/Otp.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Otp = ({ email, setEmail, setOtpModal }) => {
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(70);

  useEffect(() => {
    if (timeLeft <= 0) {
      setOtpModal(false);
      setEmail("");
      toast.info("OTP expired. Please try again.");
      return;
    }
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, setOtpModal, setEmail]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Please enter a 4-digit OTP");
      return;
    }
    try {
      const res = await fetch(
        "https://quick-port-backend.vercel.app/api/auth/verify-otp",
        {
          // const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: enteredOtp }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        const userRes = await fetch(
          "https://quick-port-backend.vercel.app/api/auth/user",
          {
            // const userRes = await fetch("http://localhost:3000/api/auth/user", {
            headers: { Authorization: `Bearer ${data.token}` },
          }
        );
        const userData = await userRes.json();
        if (userRes.ok) {
          setUserData(userData.user);
          toast.success(data.message);
          setOtpModal(false);
          setEmail("");
          navigate("/signup-details");
        } else {
          toast.error(userData.message || "Failed to load user");
          setEmail("");
          setOtpModal(false);
        }
      } else {
        toast.error(data.message || "OTP verification failed");
      }
    } catch {
      toast.error("Error verifying OTP: Network issue");
      setEmail("");
      setOtpModal(false);
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(70);
    try {
      const res = await fetch(
        "https://quick-port-backend.vercel.app/api/auth/send-otp",
        {
          // const res = await fetch("http://localhost:3000/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) toast.success("OTP resent successfully");
      else toast.error(data.message || "Failed to resend");
    } catch {
      toast.error("Error resending OTP: Network issue");
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(1, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="three-lines-label">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div
          className="modal-header"
          style={{
            borderBottom: "1px solid rgb(222,226,230)",
            margin: "0 -20px",
            padding: "10px 0 12px",
          }}
        >
          <h2>Add OTP</h2>
          <button
            onClick={() => {
              setEmail("");
              setOtpModal(false);
            }}
            className="modal-close-btn"
            style={{ right: 10, top: 0 }}
          >
            ✕
          </button>
        </div>

        <div className="otp-container">
          <h3 className="otp-title">
            Please enter the OTP sent to your email {email}
          </h3>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-box"
              />
            ))}
          </div>

          <p className="otp-timer">{formatTime(timeLeft)}</p>
          <p className="otp-resend">
            Didn't receive OTP?{" "}
            <span className="resend-link" onClick={handleResend}>
              Resend
            </span>
          </p>

          <button
            className="otp-verify-btn"
            style={{
              backgroundColor: otp.every(Boolean) ? "black" : "",
              color: otp.every(Boolean) ? "white" : "",
              cursor: otp.every(Boolean) ? "pointer" : "not-allowed",
            }}
            onClick={handleVerify}
          >
            VERIFY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
