import React from "react";
import { TagOutlined } from "@ant-design/icons";

import {
  ShareAltOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  WifiOutlined,
  CarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const HotelDetailInfo = ({ hotel, discounts }) => {
  const { name, streetAddress, rating, reviews, owner, description, discount } =
    hotel;

  const formattedRating = rating ? rating.toFixed(1) : "N/A";
  const totalGuests = reviews || 0;

  return (
    <div className="relative p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="absolute top-2 right-2 flex gap-4">
        <button className="text-gray-600 hover:text-purple-600">
          <ShareAltOutlined style={{ fontSize: "20px" }} />
        </button>
        <button className="text-gray-600 hover:text-red-600">
          <HeartOutlined style={{ fontSize: "20px" }} />
        </button>
      </div>

      <h2 className="text-2xl font-bold">{name}</h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <EnvironmentOutlined style={{ fontSize: "18px", color: "#555" }} />
          <p className="text-gray-600 ml-2">{streetAddress}</p>
        </div>
        <span className="text-yellow-500">
          {formattedRating} ({totalGuests} reviews)
        </span>
      </div>

      <div className="mt-4 flex items-center">
        <img
          src={owner.avatar}
          alt={owner.fullName}
          className="w-10 h-10 rounded-full mr-2"
        />
        <h4 className="font-semibold">Hosted by {owner.fullName}</h4>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="flex items-center">
          <ClockCircleOutlined style={{ fontSize: "20px", color: "#4CAF50" }} />
          <span className="ml-2 text-sm">Fast</span>
        </div>
        <div className="flex items-center">
          <CheckCircleOutlined style={{ fontSize: "20px", color: "#FF9800" }} />
          <span className="ml-2 text-sm">Facilities</span>
        </div>
        <div className="flex items-center">
          <HomeOutlined style={{ fontSize: "20px", color: "#2196F3" }} />
          <span className="ml-2 text-sm">Comfortable</span>
        </div>
        <div className="flex items-center">
          <WifiOutlined style={{ fontSize: "20px", color: "#03A9F4" }} />
          <span className="ml-2 text-sm">Free Wi-Fi</span>
        </div>
        <div className="flex items-center">
          <CarOutlined style={{ fontSize: "20px", color: "#FF5722" }} />
          <span className="ml-2 text-sm">Parking lot</span>
        </div>
        <div className="flex items-center">
          <AppstoreAddOutlined style={{ fontSize: "20px", color: "#8BC34A" }} />
          <span className="ml-2 text-sm">New utility</span>
        </div>
      </div>

      {discounts && discounts.length > 0 ? (
        <div className="mt-4">
          <h3 className="font-semibold text-lg text-green-600 flex items-center justify-center p-2 border border-green-500 rounded-lg bg-green-100">
            <TagOutlined className="mr-2 text-green-600" />
            Discounts Available:
          </h3>
          <ul className="list-none ml-6 space-y-2">
            {" "}
            {/* Thay đổi ở đây để loại bỏ dấu chấm */}
            {discounts.map((discountItem) => {
              const { startDate, endDate, discount } = discountItem;
              // Chuyển đổi thời gian từ định dạng ISO sang định dạng dễ đọc
              const start = new Date(startDate).toLocaleDateString();
              const end = new Date(endDate).toLocaleDateString();

              return (
                <li key={discountItem.id}>
                  <p className="text-green-700">
                    <strong>{discount.rate}%</strong> from{" "}
                    <strong>{start}</strong> to <strong>{end}</strong>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No discounts available</p>
      )}

      <hr className="my-6 border-gray-300" />

      <div>
        <h5 className="font-semibold">Stay information</h5>
        <p className="text-justify">{description}</p>
      </div>
    </div>
  );
};

export default HotelDetailInfo;
