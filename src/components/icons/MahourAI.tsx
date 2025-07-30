import React from "react";
import icon from "./mahour_transparent.png";

export function MahourIcon({ size = 24, ...props }) {
  return (
    <img
      src={icon}
      alt="Mahour AI Logo"
      width={size}
      height={size}
      {...props}
    />
  );
}
