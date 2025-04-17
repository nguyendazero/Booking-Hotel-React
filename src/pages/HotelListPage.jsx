import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Rate, Input } from "antd";
import { StarOutlined, SearchOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function HotelListPage() {
  const {
    data: hotels,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/public/hotels");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    fetchData({});
  }, [fetchData]);

  useEffect(() => {
    if (hotels) {
      const results = hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.streetAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (hotel.pricePerDay !== null &&
            hotel.pricePerDay !== undefined &&
            hotel.pricePerDay.toString().includes(searchTerm.toLowerCase())) ||
          (hotel.owner &&
            hotel.owner.fullName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (hotel.owner &&
            hotel.owner.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredHotels(results);
    }
  }, [hotels, searchTerm]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching hotels: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-md shadow-md">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-blue-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-blue-500">Hotels</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-indigo-700 font-semibold">All Hotels</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">Manage Hotels</h1>
      <div className="mb-6">
        <Input
          prefix={<SearchOutlined className="text-gray-500" />}
          placeholder="Search by Name, Address, Price, Owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64 rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {filteredHotels && filteredHotels.length > 0 ? (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={filteredHotels}
          renderItem={(hotel) => (
            <List.Item>
              <Card
                className="rounded-md shadow-md hover:shadow-lg transition duration-300"
                cover={
                  <div className="relative">
                    <img
                      alt={hotel.name}
                      src={hotel.highLightImageUrl}
                      className="h-48 w-full object-cover rounded-t-md"
                    />
                    {hotel.rating !== null && hotel.rating !== undefined && (
                      <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-md p-1 shadow-sm">
                        <Rate
                          disabled
                          allowHalf
                          defaultValue={hotel.rating}
                          style={{ color: "#fadb14", fontSize: "12px" }}
                        />
                      </div>
                    )}
                  </div>
                }
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {hotel.name}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {hotel.description}
                </p>
                <p className="text-green-600 font-semibold mb-1">
                  Price: ${hotel.pricePerDay} / night
                </p>
                <p className="text-gray-700 mb-1">
                  <strong className="text-blue-500">Address:</strong>{" "}
                  {hotel.streetAddress}
                </p>
                {hotel.owner && (
                  <p className="text-gray-700 text-sm italic">
                    Owner: {hotel.owner.fullName} ({hotel.owner.email})
                  </p>
                )}
                {/* Discount is no longer displayed */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">
          {searchTerm
            ? "No hotels found matching your search."
            : "No hotels found."}
        </p>
      )}
    </div>
  );
}

export default HotelListPage;
