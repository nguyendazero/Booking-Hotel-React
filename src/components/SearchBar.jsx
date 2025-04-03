import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchDistricts, setQuery, clearQuery } from "../store/searchSlice";
import { useNavigate } from "react-router-dom";
import { ClearOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { districts, query, loading } = useSelector((state) => state.search);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchDistricts()); // Fetch danh sách districts khi component mount
  }, [dispatch]);

  // Hàm xử lý khi nhấn Search
  const handleSearch = () => {
    const updatedQuery = {
      districtId: query.districtId,
      name: query.name,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      startDate: query.startDate,
      endDate: query.endDate,
      amenityNames: query.amenityNames,
    };
    dispatch(setQuery(updatedQuery));
    const searchParams = new URLSearchParams(updatedQuery).toString(); // Chuyển query thành query string
    navigate(`/hotels?${searchParams}`); // Chuyển hướng đến HotelsPage với query parameters
  };

  const handleClearFilters = () => {
    dispatch(clearQuery());
    navigate("/hotels");
  };

  return (
    <div className="absolute top-0 w-full flex justify-center mt-120">
      <div className="bg-white rounded-lg shadow-lg p-4 flex items-center max-w-5xl w-full">
        {/* Dropdown cho District */}
        <div className="relative">
          <button
            className="border border-gray-300 rounded-l-lg py-2 px-4 w-full text-left text-gray-700 bg-white transition duration-300 ease-in-out hover:bg-gray-100 focus:outline-none truncate"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {query.districtId
              ? districts.find((d) => d.id === query.districtId)?.name ||
                "Location"
              : "Location"}
          </button>
          {showDropdown && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-50px mt-1 max-h-60 overflow-y-auto">
              {loading ? (
                <li className="py-2 px-4">Loading...</li>
              ) : (
                districts.map((district) => (
                  <li
                    key={district.id}
                    onClick={() => {
                      dispatch(setQuery({ districtId: district.id }));
                      setShowDropdown(false);
                    }}
                    className="py-2 px-4 cursor-pointer hover:bg-purple-100 whitespace-nowrap"
                  >
                    {district.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        {/* DatePicker */}
        <div className="h-[42px] mx-2">
          <RangePicker
            className="h-full w-full"
            onChange={(dates) =>
              dispatch(
                setQuery({
                  startDate: dates ? dates[0].toISOString() : null,
                  endDate: dates ? dates[1].toISOString() : null,
                })
              )
            }
          />
        </div>

        {/* Input Name */}
        <input
          type="text"
          placeholder="Search hotel by name..."
          className="border border-gray-300 rounded py-2 px-4 w-64"
          value={query.name}
          onChange={(e) => dispatch(setQuery({ name: e.target.value }))}
        />

        {/* Input Min Price */}
        <input
          type="number"
          placeholder="Min Price ($)"
          className="border border-gray-300 py-2 px-4 w-35 mx-2 rounded"
          value={query.minPrice}
          onChange={(e) => dispatch(setQuery({ minPrice: e.target.value }))}
        />

        {/* Input Max Price */}
        <input
          type="number"
          placeholder="Max Price ($)"
          className="border border-gray-300 py-2 px-4 w-35 rounded"
          value={query.maxPrice}
          onChange={(e) => dispatch(setQuery({ maxPrice: e.target.value }))}
        />

        {/* Nút Search */}
        <button
          className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:shadow-xl ml-2 w-16 cursor-pointer"
          onClick={handleSearch} // Khi nhấn nút, chuyển đến HotelsPage
        >
          🔍
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:shadow-xl ml-2 w-16 cursor-pointer"
          onClick={handleClearFilters} // Khi nhấn nút, chuyển đến HotelsPage
        >
          <ClearOutlined />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
