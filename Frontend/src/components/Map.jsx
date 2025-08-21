import React from "react";

const Map = () => {
  return (
    <div
      className="home-map-container"
      // style={{ width: "100%", height: "400px" }}
    >
      <iframe
        // title="google-map"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        // allowFullScreen
        src="https://www.google.com/maps?q=Lahore,Pakistan&output=embed"
      ></iframe>
    </div>
  );
};

export default Map;
