import React, { useState, useEffect } from "react";
import { Button, Card, DatePicker, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import isBetween from "dayjs/plugin/isBetween";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const HotelDetailReserve = ({ hotel }) => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const { pricePerDay } = hotel;

  const [dates, setDates] = useState(null);
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [applicableDiscount, setApplicableDiscount] = useState(null);
  const [discountedNights, setDiscountedNights] = useState(0);

  const { data: discounts, loading, error, fetchData } = useFetch(
    `http://localhost:8080/api/v1/public/hotel/${hotel.id}/discounts`
  );

  const {
    postData,
    loading: bookingLoading,
    error: bookingError,
  } = usePost("http://localhost:8080/api/v1/user/booking");

  useEffect(() => {
    if (hotel.id) {
      fetchData(); // Gọi fetchData để lấy dữ liệu
    }
  }, [hotel.id, fetchData]); // Chạy lại khi hotel.id thay đổi

  const handleDateChange = (dates) => {
    setDates(dates);
    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]);
      const endDate = dayjs(dates[1]);

      const diff = endDate.diff(startDate, "days");
      setNights(diff);
      calculateTotal(diff, [startDate, endDate]);
    }
  };

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
        const discountStartDate = dayjs(foundDiscount.startDate);
        const discountEndDate = dayjs(foundDiscount.endDate);

        const stayStartDate = dayjs(dates[0]);
        const stayEndDate = dayjs(dates[1]);

        const discountedNightsStart = stayStartDate.isBefore(discountStartDate)
          ? discountStartDate.diff(stayStartDate, "day")
          : 0;

        const discountedNightsEnd = stayEndDate.isAfter(discountEndDate)
          ? discountEndDate.diff(stayStartDate, "day")
          : stayEndDate.diff(stayStartDate, "day");

        const discountedNightsCount =
          discountedNightsStart + discountedNightsEnd;

        setDiscountedNights(discountedNightsCount);

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
      setDiscountApplied(false);
      setApplicableDiscount(null);
      setTotalPrice(pricePerDay * nights);
    }
  };

  const serviceCharge = 0;
  const total = totalPrice + serviceCharge;

  const handleReserve = async () => {
    const bookingData = {
      hotelId: hotel.id,
      startDate: dates[0].toISOString(),
      endDate: dates[1].toISOString(),
    };

    try {
      const response = await postData(bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        window.location.href = response.sessionUrl;
      } else {
        message.error("Failed to reserve the booking. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking:", error);
      message.error("Error during booking.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Card className="w-full md:w-[70%] rounded-lg p-6 shadow-md mx-auto md:mx-4 ml-[15px]">
      <h2 className="text-xl font-bold">${pricePerDay} /night</h2>
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
        {nights > 0 ? `Stay for ${nights} nights` : "Select check-in and check-out dates"}
      </p>
      <hr className="my-4 border-gray-300" />
      <div className="flex justify-between">
        <p className="font-semibold">${pricePerDay} x {nights} night</p>
        <p className="font-semibold">${pricePerDay * nights}</p>
      </div>
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
      <div className="flex justify-between font-semibold">
        <p>Total</p>
        <p>${total.toFixed(2)}</p>
      </div>
      <Button
        type="primary"
        className="w-full mt-6"
        onClick={handleReserve}
        loading={bookingLoading}
      >
        Reserve
      </Button>
      {bookingError && (
        <p className="text-red-600 font-bold text-center">{bookingError}</p>
      )}
    </Card>
  );
};

export default HotelDetailReserve;
