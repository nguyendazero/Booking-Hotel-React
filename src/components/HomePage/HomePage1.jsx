import React, { useState } from "react";
import heroImage from "../../assets/image/hero-right.webp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useFetch from "../../hooks/useFetch";

const HomePage1 = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Sử dụng custom hook để gọi API
  const {
    data: locations,
    loading,
    error,
  } = useFetch("http://localhost:8080/api/v1/public/districts");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching locations</div>;

  return (
    <div className="relative flex justify-center p-0 bg-gradient-to-r from-purple-100 via-purple-50 to-purple-200 min-h-screen">
      <div className="flex flex-col md:flex-row max-w-6xl w-full h-auto md:h-[90vh]">
        <div className="flex-1 text-left mb-8 md:mr-8 flex flex-col justify-start mt-20 relative">
          <h1 className="text-7xl font-bold">Hotel, car & experiences</h1>
          <p className="text-lg text-gray-600 mt-6 mb-6">
            Accompanying us, you have a trip full of experiences. With Chisfis,
            booking accommodation, resort villas, hotels.
          </p>
          <button className="bg-gradient-to-r from-purple-800 to-violet-400 text-white py-3 px-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-[200px]">
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
              className="border border-gray-300 rounded-l-lg py-2 px-4 w-full text-left text-gray-700 bg-white transition duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent truncate" // Giới hạn văn bản
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {location
                ? location.length > 15
                  ? `${location.substring(0, 15)}...`
                  : location
                : "Location"}
            </button>
            {showDropdown && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-50px mt-1 max-h-60 overflow-y-auto">
                {locations.map((loc) => (
                  <li
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc.name);
                      setShowDropdown(false);
                    }}
                    className="py-2 px-4 cursor-pointer hover:bg-purple-100 whitespace-nowrap" // Thêm lớp này
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
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
              className="border border-gray-300 py-2 px-4 w-32 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="border border-gray-300 py-2 px-4 w-32 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Input cho Name hotel */}
          <input
            type="text"
            placeholder="Search hotel by name..."
            className="border border-gray-300 rounded py-2 px-4 w-64 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          {/* Input cho giá min */}
          <input
            type="number"
            placeholder="Min Price ($)"
            className="border border-gray-300 py-2 px-4 w-35 placeholder-gray-400 mx-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          {/* Input cho giá max */}
          <input
            type="number"
            placeholder="Max Price ($)"
            className="border border-gray-300 py-2 px-4 w-35 placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

          <button className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:shadow-xl transition-shadow duration-300 ml-2 w-16 cursor-pointer">
            🔍
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage1;
