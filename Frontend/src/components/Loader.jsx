import React from "react";
import { Spiral } from "ldrs/react";
import "ldrs/react/Spiral.css";

const Loader = ({
  loading,
  className = "loaderWrapper",
  size = "50",
  color = "black",
  speed = "0.9",
}) => {
  return (
    loading && (
      <div className={className}>
        <Spiral size={size} speed={speed} color={color} />
      </div>
    )
  );
};

export default Loader;
