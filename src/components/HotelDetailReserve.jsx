import React, { useState } from "react";
import { Button, Card, DatePicker } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useFetch from "../hooks/useFetch";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween); // Kích hoạt plugin

const { RangePicker } = DatePicker;

const HotelDetailReserve = ({ hotel }) => {
  const { pricePerDay } = hotel;

  // State để lưu trữ ngày chọn, số đêm, tổng giá, có giảm giá hay không và discount hiện tại
  const [dates, setDates] = useState(null);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [applicableDiscount, setApplicableDiscount] = useState(null); // Thêm state để lưu discount đang áp dụng
  const [discountedNights, setDiscountedNights] = useState(0); // Thêm trạng thái cho discountedNights

  const {
    data: discounts,
    loading,
    error,
  } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotel.id}/discounts`
  );

  // Hàm xử lý thay đổi ngày chọn
  const handleDateChange = (dates) => {
    setDates(dates);
    if (dates && dates[0] && dates[1]) {
      // Chuyển đổi ngày thành đối tượng dayjs
      const startDate = dayjs(dates[0]);
      const endDate = dayjs(dates[1]);

      const diff = endDate.diff(startDate, "days");
      setNights(diff);
      calculateTotal(diff, [dayjs(startDate), dayjs(endDate)]);
    }
  };

  // Tính toán tổng giá (có áp dụng giảm giá nếu có)
  const calculateTotal = (nights, dates) => {
    let totalDiscountedPrice = 0;
    let totalRegularPrice = 0;

    if (discounts && discounts.length > 0) {
      const foundDiscount = discounts.find((discount) => {
        const discountStartDate = dayjs(discount.startDate);
        const discountEndDate = dayjs(discount.endDate);
        return (
          dayjs(dates[0]).isBetween(
            discountStartDate,
            discountEndDate,
            null,
            "[]"
          ) ||
          dayjs(dates[1]).isBetween(
            discountStartDate,
            discountEndDate,
            null,
            "[]"
          ) ||
          (dayjs(dates[0]).isBefore(discountEndDate) &&
            dayjs(dates[1]).isAfter(discountStartDate))
        );
      });

      if (foundDiscount) {
        // Calculate nights with discount
        const discountStartDate = dayjs(foundDiscount.startDate);
        const discountEndDate = dayjs(foundDiscount.endDate);

        const stayStartDate = dayjs(dates[0]);
        const stayEndDate = dayjs(dates[1]);

        // Days eligible for discount
        const discountedNightsStart = stayStartDate.isBefore(discountStartDate)
          ? discountStartDate.diff(stayStartDate, "day")
          : 0;

        const discountedNightsEnd = stayEndDate.isAfter(discountEndDate)
          ? discountEndDate.diff(stayStartDate, "day")
          : stayEndDate.diff(stayStartDate, "day");

        const discountedNightsCount =
          discountedNightsStart + discountedNightsEnd; // Tính tổng số đêm giảm giá

        // Lưu discountedNights vào trạng thái
        setDiscountedNights(discountedNightsCount);

        // Total price calculation
        totalDiscountedPrice =
          discountedNightsCount *
          pricePerDay *
          (1 - foundDiscount.discount.rate / 100);
        totalRegularPrice = (nights - discountedNightsCount) * pricePerDay;

        setDiscountApplied(true);
        setApplicableDiscount(foundDiscount);
        setTotalPrice(totalDiscountedPrice + totalRegularPrice);
      } else {
        setApplicableDiscount(null);
        setDiscountApplied(false);
        setTotalPrice(pricePerDay * nights);
      }
    } else {
      console.log("No discounts available.");
      setDiscountApplied(false);
      setApplicableDiscount(null);
      setTotalPrice(pricePerDay * nights);
    }
  };

  const serviceCharge = 0;
  const total = totalPrice + serviceCharge;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card className="w-full md:w-[70%] rounded-lg p-6 shadow-md mx-auto md:mx-4 ml-[15px]">
      <h2 className="text-xl font-bold">${pricePerDay} /night</h2>

      {/* RangePicker để chọn ngày nhận phòng và trả phòng */}
      <div className="flex items-center">
        <CalendarOutlined className="mr-2" />
        <RangePicker
          format="MMM DD"
          onChange={handleDateChange}
          value={dates}
          placeholder={["Check-in", "Check-out"]}
        />
      </div>

      <p className="font-semibold mt-2">
        {nights > 0
          ? `Stay for ${nights} nights`
          : "Select check-in and check-out dates"}
      </p>

      <hr className="my-4 border-gray-300" />

      {/* Tính toán giá cơ bản */}
      <div className="flex justify-between">
        <p className="font-semibold">
          ${pricePerDay} x {nights} night
        </p>
        <p className="font-semibold">${pricePerDay * nights}</p>
      </div>

      {/* Hiển thị thông báo giảm giá nếu có */}
      {discountApplied && applicableDiscount ? (
        <div className="flex justify-between">
          <p className="font-semibold text-green-500">Discount Applied</p>
          <p className="font-semibold">
            -$
            {(
              discountedNights *
              pricePerDay *
              (applicableDiscount.discount.rate / 100)
            ).toFixed(2)}
          </p>
        </div>
      ) : dates && nights > 0 ? (
        <div className="flex justify-between">
          <p className="font-semibold text-red-500">No Discounts</p>
          <p className="font-semibold">- $0.00</p>
        </div>
      ) : null}

      <hr className="my-4 border-gray-300" />

      {/* Hiển thị tổng giá cuối cùng */}
      <div className="flex justify-between font-semibold">
        <p>Total</p>
        <p>${total.toFixed(2)}</p>
      </div>

      <Button type="primary" className="w-full mt-6">
        Reserve
      </Button>
    </Card>
  );
};

export default HotelDetailReserve;
