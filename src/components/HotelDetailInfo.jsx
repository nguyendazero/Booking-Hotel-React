import React from "react";
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

const HotelDetailInfo = ({ hotel }) => {
    const {
        name,
        streetAddress,
        pricePerDay,
        rating,
        reviews,
        owner,
        description,
        discount
    } = hotel;

    const formattedRating = rating ? rating.toFixed(1) : 'N/A';
    const totalGuests = reviews || 0;

    return (
        <div className="relative p-6 border border-gray-300 rounded-lg bg-white">
            <div className="absolute top-2 right-2 flex gap-4">
                <button className="text-gray-600 hover:text-purple-600">
                    <ShareAltOutlined style={{ fontSize: '20px' }} />
                </button>
                <button className="text-gray-600 hover:text-red-600">
                    <HeartOutlined style={{ fontSize: '20px' }} />
                </button>
            </div>

            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <EnvironmentOutlined style={{ fontSize: '18px', color: '#555' }} />
                    <p className="text-gray-600 ml-2">{streetAddress}</p>
                </div>
                <span className="text-yellow-500">{formattedRating} ({totalGuests} reviews)</span>
            </div>

            <div className="mt-4 flex items-center">
                <img src={owner.avatar} alt={owner.fullName} className="w-10 h-10 rounded-full mr-2" />
                <h4 className="font-semibold">Hosted by {owner.fullName}</h4>
            </div>

            <div className="mt-4 flex justify-between">
                <div className="flex items-center">
                    <ClockCircleOutlined style={{ fontSize: '20px', color: '#4CAF50' }} />
                    <span className="ml-2 text-sm">Fast</span>
                </div>
                <div className="flex items-center">
                    <CheckCircleOutlined style={{ fontSize: '20px', color: '#FF9800' }} />
                    <span className="ml-2 text-sm">Facilities</span>
                </div>
                <div className="flex items-center">
                    <HomeOutlined style={{ fontSize: '20px', color: '#2196F3' }} />
                    <span className="ml-2 text-sm">Comfortable</span>
                </div>
                <div className="flex items-center">
                    <WifiOutlined style={{ fontSize: '20px', color: '#03A9F4' }} />
                    <span className="ml-2 text-sm">Free Wi-Fi</span>
                </div>
                <div className="flex items-center">
                    <CarOutlined style={{ fontSize: '20px', color: '#FF5722' }} />
                    <span className="ml-2 text-sm">Parking lot</span>
                </div>
                <div className="flex items-center">
                    <AppstoreAddOutlined style={{ fontSize: '20px', color: '#8BC34A' }} />
                    <span className="ml-2 text-sm">New utility</span>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                {discount && <p className="text-green-600">Discount: <strong>{discount.rate}%</strong></p>}
            </div>

            <hr className="my-6 border-gray-300" />

            <div>
                <h5 className="font-semibold">Stay information</h5>
                <p>{description}</p>
            </div>
        </div>
    );
};


export default HotelDetailInfo;
