import React from "react";
import heroImage from "../../assets/image/hero-right.webp";

const HomePage1 = () => {
  return (
    <div className="flex justify-center p-0 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200">
      <div className="flex flex-col md:flex-row max-w-6xl w-full h-auto md:h-[90vh]">
        <div className="flex-1 text-left mb-8 md:mr-8 flex flex-col justify-start mt-30 relative">
          <h1 className="text-5xl font-bold">Hotel, car & experiences</h1>
          <p className="text-lg text-gray-600 mt-4 mb-6">
            Accompanying us, you have a trip full of experiences. With Chisfis,
            booking accommodation, resort villas, hotels.
          </p>
          <button className="bg-gradient-to-r from-purple-800 to-violet-400 text-white py-3 px-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-[300px]">
            Start your search
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center h-full">
          <img
            src={heroImage}
            alt="Hotel, car & experiences"
            className="w-130 max-h-full rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage1;
