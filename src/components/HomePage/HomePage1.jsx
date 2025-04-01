import React, { useState } from "react";
import heroImage from "../../assets/image/hero-right.webp";
import DatePicker from "react-datepicker"; // Cần cài thư viện này
import "react-datepicker/dist/react-datepicker.css"; // Để áp dụng kiểu dành cho DatePicker

const HomePage1 = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");

  return (
    <div className="relative flex justify-center p-0 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200 min-h-screen">
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

      {/* Thanh tìm kiếm chồng lên */}
      <div className="absolute top-0 w-full flex justify-center mt-120">
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center max-w-5xl w-full">
          {/* Dropdown cho location */}
          <div className="relative">
            <button
              className="border border-gray-300 rounded-l-lg py-2 px-4 w-full text-left text-gray-700 bg-white transition duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onClick={() => {
                /* Mở dropdown ở đây */
              }}
            >
              {location || "Location"}
            </button>
          </div>

          {/* DatePicker cho Check In - Check Out */}
          <div className="mx-1">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check In"
              className="border border-gray-300 py-2 px-4 w-32 rounded-lg"
            />
          </div>
          <div className="mx-1">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check Out"
              className="border border-gray-300 py-2 px-4 w-32 rounded-lg"
            />
          </div>

          {/* Input cho Name hotel */}
          <input
            type="text"
            placeholder="Search hotel by name..."
            className="border border-gray-300 rounded py-2 px-4 w-64 placeholder-gray-400"
          />

          {/* Input cho giá min */}
          <input
            type="number"
            placeholder="Min Price ($)"
            className="border border-gray-300 py-2 px-4 w-35 placeholder-gray-400 mx-2 rounded"
          />

          {/* Input cho giá max */}
          <input
            type="number"
            placeholder="Max Price ($)"
            className="border border-gray-300 py-2 px-4 w-35 placeholder-gray-400 rounded"
          />

          <button className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:shadow-xl transition-shadow duration-300 ml-2 w-16">
            🔍
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage1;
