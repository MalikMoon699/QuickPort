//  Frontend/src/components/Map.jsx
import React, { useState } from "react";
import Loader from "./Loader";

const Map = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="home-map-container">
      {loading ? (
        <Loader loading={true}/>
      ) : (
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src="https://www.google.com/maps?q=Lahore,Pakistan&output=embed"
        ></iframe>
      )}
    </div>
  );
};

export default Map;
