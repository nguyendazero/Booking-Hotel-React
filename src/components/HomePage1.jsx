// src/pages/HomePage1.jsx
import React from "react";
import heroImage from "../assets/image/hero-right.webp";
import SearchBar from "./SearchBar"; // Import SearchBar
import { Button } from "antd";

const HomePage1 = ( { title}) => {
  return (
    <div className="relative flex justify-center p-0 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200 min-h-screen">
      <div className="flex flex-col md:flex-row max-w-6xl w-full h-auto md:h-[90vh]">
        <div className="flex-1 text-left mb-8 md:mr-8 flex flex-col justify-start mt-20 relative">
          <h1 className="text-7xl font-bold">{title}</h1>
          <p className="text-lg text-gray-600 mt-6 mb-6">
            Accompanying us, you have a trip full of experiences. With Chisfis,
            booking accommodation, resort villas, hotels.
          </p>
          <Button
            color="purple"
            variant="solid"
            style={{ height: "46px", width: "250px" }}
          >
            Start your search
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center h-full">
          <img
            src={heroImage}
            alt="Hotel, car & experiences"
            className="w-130 max-h-full rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Sử dụng SearchBar */}
      <SearchBar />
    </div>
  );
};

export default HomePage1;
