import React, { useState, useEffect } from "react";
import { TagOutlined } from "@ant-design/icons";
import { formatDate } from "../util/dateUtils";
import { useSelector } from "react-redux";
import usePost from "../hooks/usePost";
import useFetch from "../hooks/useFetch";
import { message } from "antd";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import {
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  WifiOutlined,
  CarOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const HotelDetailInfo = ({ hotel, discounts }) => {
  const {
    id: hotelId,
    name,
    streetAddress,
    rating,
    reviews,
    owner,
    description,
  } = hotel;
  const token = useSelector((state) => state.auth.token);
  const {
    postData: addToWishlistApi,
    loading: addingToWishlist,
    error: wishlistError,
  } = usePost(`${API_BASE_URL}/api/v1/user/wishlist/${hotelId}`);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch user's wishlist
  const {
    data: userWishlist,
    fetchData: fetchUserWishlist,
    loading: fetchingWishlist,
    error: fetchWishlistError,
  } = useFetch(`${API_BASE_URL}/api/v1/user/hotel/wishlist`);

  useEffect(() => {
    // Fetch user's wishlist when component mounts
    if (token) {
      fetchUserWishlist({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token, fetchUserWishlist]);

  useEffect(() => {
    // Check if the current hotel is in the user's wishlist
    if (userWishlist && Array.isArray(userWishlist)) {
      const isHotelInWishlist = userWishlist.some(
        (wishlistItem) => wishlistItem.id === hotelId
      );
      setIsWishlisted(isHotelInWishlist);
    }
  }, [userWishlist, hotelId]);

  const formattedRating = rating ? rating.toFixed(1) : "N/A";
  const totalGuests = reviews || 0;

  const handleAddToWishlist = async () => {
    if (!token) {
      message.error("Please log in to add to your wishlist.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await addToWishlistApi(null, config);

    if (response) {
      setIsWishlisted(true);
      message.success(`${name} added to your wishlist!`);
      // Re-fetch wishlist to update state
      fetchUserWishlist({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (wishlistError) {
      message.error(`Failed to add to wishlist: ${wishlistError}`);
    }
  };

  return (
    <div className="relative p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      <div className="absolute top-2 right-2 flex gap-4">
        <button className="text-gray-600 hover:text-purple-600">
          <ShareAltOutlined style={{ fontSize: "20px" }} />
        </button>
        <button
          className={`text-gray-600 hover:text-red-600 ${
            addingToWishlist ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
        >
          {fetchingWishlist ? (
            <span className="animate-spin">
              <HeartOutlined style={{ fontSize: "20px" }} />
            </span>
          ) : isWishlisted ? (
            <HeartFilled style={{ fontSize: "20px", color: "red" }} />
          ) : (
            <HeartOutlined style={{ fontSize: "20px" }} />
          )}
        </button>
      </div>
      <h2 className="text-2xl font-bold">{name}</h2>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <EnvironmentOutlined style={{ fontSize: "18px", color: "#006400" }} />
          <p className="text-green-800 ml-1">{streetAddress}</p>
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
      <p className="text-gray-600 text-sm mb-2 mt-2">📞 {owner.phone || "0"}</p>
      <p className="text-gray-600 text-sm">📧 {owner.email}</p>
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

      <div className="mt-4">
        <h3 className="font-semibold text-lg text-green-600 flex items-center justify-start p-2 border border-green-500 rounded-lg bg-green-100 mb-4">
          <TagOutlined className="mr-2 text-green-600" />
          Discounts Available:
        </h3>
        {discounts && discounts.length > 0 ? (
          <ul className="list-none ml-6 space-y-4">
            {discounts.map((discountItem) => {
              const { startDate, endDate, discount } = discountItem;
              const start = formatDate(startDate);
              const end = formatDate(endDate);

              return (
                <li
                  key={discountItem.id}
                  className="flex items-center space-x-2"
                >
                  <p className="text-green-700">
                    <strong>{discount.rate}%</strong> off from{" "}
                    <strong>{start}</strong> to <strong>{end}</strong>
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">No discounts available</p>
        )}
      </div>

      <hr className="my-6 border-gray-300" />
      <div>
        <h5 className="font-semibold">Stay information</h5>
        <p className="text-justify">{description}</p>
      </div>
    </div>
  );
};

export default HotelDetailInfo;