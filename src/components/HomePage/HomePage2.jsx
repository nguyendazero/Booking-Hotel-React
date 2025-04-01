import React, { useState } from "react";
import newYorkImage from "../../assets/image/new-york.png";
import singaporeImage from "../../assets/image/singapore.jpg";
import parisImage from "../../assets/image/paris.jpg";
import londonImage from "../../assets/image/london.webp";
import tokyoImage from "../../assets/image/tokyo.webp";
import maldivesImage from "../../assets/image/maldives.webp";

const HomePage2 = () => {
  const locations = [
    { name: "New York", properties: "188,288 properties", image: newYorkImage },
    { name: "Singapore", properties: "188,288 properties", image: singaporeImage },
    { name: "Paris", properties: "188,288 properties", image: parisImage },
    { name: "London", properties: "188,288 properties", image: londonImage },
    { name: "Tokyo", properties: "188,288 properties", image: tokyoImage },
    { name: "Maldives", properties: "188,288 properties", image: maldivesImage },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(locations.slice(0, 5));

  const nextItems = () => {
    if (currentIndex + 5 < locations.length) {
      setCurrentIndex(currentIndex + 1);
      setVisibleItems(locations.slice(currentIndex + 1, currentIndex + 6));
    }
  };

  const prevItems = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setVisibleItems(locations.slice(currentIndex - 1, currentIndex + 4));
    }
  };

  return (
    <div className="p-8 bg-gray-50 relative flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2 text-center">Suggestions for discovery</h2>
      <p className="mb-6 text-gray-600 text-center">Popular places to recommend for you</p>
      
      <div className="flex items-center justify-between mb-4 w-full max-w-lg">
        <button 
          onClick={prevItems} 
          disabled={currentIndex === 0} 
          className="bg-gray-300 rounded-full p-2 cursor-pointer disabled:opacity-50"
        >
          ◀️
        </button>
        <button 
          onClick={nextItems} 
          disabled={currentIndex + 5 >= locations.length} 
          className="bg-gray-300 rounded-full p-2 cursor-pointer disabled:opacity-50"
        >
          ▶️
        </button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto mb-6">
        {visibleItems.map((location, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 w-64">
            <img src={location.image} alt={location.name} className="w-full h-80 object-cover cursor-pointer" />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-xl cursor-pointer">{location.name}</h3>
              <p className="text-gray-500">{location.properties}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage2;