import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const Loader = ({ loading, className = "loaderWrapper", size = "50" }) => {
  return (
    loading && (
      <div className={className}>
        <Spiral size={size} speed="0.9" color="black" />
      </div>
    )
  );
};

export default Loader;
