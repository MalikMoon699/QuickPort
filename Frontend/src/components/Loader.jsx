import React from "react";
import { Spiral, Ripples } from "ldrs/react";
import "ldrs/react/Spiral.css";
import "ldrs/react/Ripples.css";

const Loader = ({
  loading,
  className = "loaderWrapper",
  size = "50",
  color = "black",
  speed = "0.9",
  loaderType = "circle",
}) => {
  return (
    loading && (
      <div className={className}>
        {loaderType === "circle" ? (
          <Spiral size={size} speed={speed} color={color} />
        ) : (
          <Ripples size={size} speed={speed} color={color} />
        )}
      </div>
    )
  );
};

export default Loader;
