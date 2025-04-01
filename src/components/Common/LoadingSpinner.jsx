import React from "react";
import { Spin } from "antd";

const LoadingSpinner = ({ tip = "Loading", size = "large" }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Spin tip={tip} size={size} />
    </div>
  );
};

export default LoadingSpinner;
