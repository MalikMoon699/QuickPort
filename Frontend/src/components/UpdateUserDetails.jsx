import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Placeholder } from '../assets/images/Images';
import { UserRound } from "lucide-react"
import { useNavigate } from 'react-router';

const UpdateUserDetails = ({ setIsProfileDetails }) => {
  const { userData ,logout} = useAuth();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        setIsProfileDetails(false);
      }}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content header-user-info-modal"
      >
        <div>
          <h1>
            <button
              className="modal-back-btn"
              onClick={() => {
                setIsProfileDetails(false);
              }}
            >
              ❮
            </button>
            {userData.firstName} {userData.lastName}
          </h1>
          <img src={userData.profileImg || Placeholder} />
        </div>
        <div>
          <span>QuickPort Cash</span>
          <span>PKR 0.00</span>
        </div>
        <div onClick={() => {navigate("/signup-details")}}>
          <UserRound fill="black" size={20} /> Manage Account
        </div>
        <div>
          <button onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserDetails
