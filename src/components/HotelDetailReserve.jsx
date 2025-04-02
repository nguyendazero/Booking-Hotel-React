import React from "react";
import { Button, Card } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";

const HotelDetailReserve = () => {
  const pricePerNight = 119;
  const nights = 3;
  const totalPrice = pricePerNight * nights;
  const serviceCharge = 0;
  const total = totalPrice + serviceCharge;

  return (
    <Card className="w-full md:w-[72%] rounded-lg p-6 shadow-md mx-auto md:mx-4 ml-[15px]"> {/* margin auto để căn giữa */}
      <h2 className="text-xl font-bold">${pricePerNight} /night</h2>
      <p className="text-yellow-500">☆ 4.5 (112)</p>
      <p className="flex items-center">
        <CalendarOutlined className="mr-2" /> Feb 06 - Feb 23
      </p>
      <p className="font-semibold">Check In - Check Out</p>
      <p className="flex items-center">
        <UserOutlined className="mr-2" /> 4 Guests
      </p>
      <p className="font-semibold">Guests</p>
      <hr className="my-4 border-gray-300" />
      <div className="flex justify-between">
        <p className="font-semibold">${pricePerNight} x {nights} night</p>
        <p className="font-semibold">${totalPrice}</p>
      </div>
      <div className="flex justify-between">
        <p className="font-semibold">Service charge</p>
        <p className="font-semibold">${serviceCharge}</p>
      </div>
      <hr className="my-4 border-gray-300" />
      <div className="flex justify-between font-semibold">
        <p>Total</p>
        <p>${total}</p>
      </div>
      <Button type="primary" className="w-full mt-6">
        Reserve
      </Button>
    </Card>
  );
};

export default HotelDetailReserve;
