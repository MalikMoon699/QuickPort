// Frontend/src/auth/SignUp.jsx
import React, { useState } from "react";
import { WhiteLogo, GoogleIcon, AppleIcon } from "../assets/images/Images";
import { useLocation, useNavigate } from "react-router";
import Otp from "./Otp";
import { toast } from "react-toastify";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [email, setEmail] = useState("");
  const { type } = location.state || {};

  const handleSignUp = async () => {
    if (loading) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, type }),
            }
          );
      const data = await response.json();
      if (response.ok) {
        setOtpModal(true);
        toast.success(data.message);
      } else {
        setOtpModal(false);
        toast.error(data.message || "Failed to send OTP");
      }
    } catch {
      toast.error("Error sending OTP: Network issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <div>
          <img src={WhiteLogo} alt="logo" />
          <span>QuickPort</span>
        </div>
        <div className="auth-header-login-btn-container">
          <button
            onClick={() => navigate("/login")}
            className="auth-header-login-btn"
          >
            Login
          </button>
        </div>
      </div>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">
            {type === "ride"
              ? "Sign up as Rider"
              : type === "drive"
              ? "Sign up as Driver"
              : "What's your email?"}
          </h2>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <button
            onClick={handleSignUp}
            className="btn btn-primary"
            style={{
              backgroundColor:
                !email || !email.includes("@") || loading ? "#0000003d" : "",
              cursor:
                !email || !email.includes("@") || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Loading..." : "Continue"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="btn btn-google">
            <img src={GoogleIcon} alt="google" />
            Continue with Google
          </button>
          <button className="btn btn-apple">
            <img src={AppleIcon} alt="apple" />
            Continue with Apple
          </button>

          <p className="login-footer">
            By proceeding, you consent to get calls, WhatsApp or SMS/RCS
            messages, including by automated means, from QuickPort and its
            affiliates to the number provided.
          </p>
        </div>
      </div>

      {otpModal && (
        <Otp setOtpModal={setOtpModal} email={email} setEmail={setEmail} />
      )}
    </>
  );
};

export default SignUp;
