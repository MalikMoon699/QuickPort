//  Frontend/src/components/Map.jsx
import React from "react";

const Map = () => {
  return (
    <div
      className="home-map-container"
    >
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        src="https://www.google.com/maps?q=Lahore,Pakistan&output=embed"
      ></iframe>
    </div>
  );
};

export default Map;
