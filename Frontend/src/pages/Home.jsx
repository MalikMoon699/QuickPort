// Frontend/src/pages/Home.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { userData } = useAuth();
  const email = userData?.email || "guest";

  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to QuickPort, {email}</h1>
      {userData?.firstName && (
        <p>
          Name: {userData.firstName} {userData.lastName}
        </p>
      )}
    </div>
  );
};

export default Home;

