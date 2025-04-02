import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const SearchBar = () => {
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
                  className="py-2 px-4 cursor-pointer hover:bg-purple-100 whitespace-nowrap"
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* DatePicker cho Check In - Check Out */}
        <div className="h-[42px] mx-2">
          <RangePicker className="h-full w-full" />
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
  );
};

export default SearchBar;
