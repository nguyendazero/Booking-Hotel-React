import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import BookingHistory from "../components/BookingHistory";
import { Link } from "react-router-dom";
import { Button, Result } from "antd"; // Nhập Result và Button từ antd
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BookingHistoryPage() {
  // Get token from Redux
  const token = useSelector((state) => state.auth.token);

  const {
    data: bookingsHistory,
    loading: bookingsHistoryLoading,
    error: bookingsHistoryError,
    fetchData,
  } = useFetch(`${API_BASE_URL}/api/v1/user/bookings`);

  // Fetch bookings when token changes
  useEffect(() => {
    if (token) {
      fetchData({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [fetchData, token]);

  if (bookingsHistoryLoading) return <LoadingSpinner />;
  if (bookingsHistoryError)
    return <p>Error loading check-in details: {bookingsHistoryError}</p>;
  if (!bookingsHistory || bookingsHistory.length === 0)
    return (
      <div className="mt-5 mb-5">
        <Result
          status="info"
          title="You have not booked any hotel in history"
          subTitle="It looks like there are no bookings in your account. Please make a reservation to see it here."
          extra={
            <Link to="/hotels">
              <Button type="primary" key="newBooking">
                Booking now
              </Button>
            </Link>
          }
        />
      </div>
    );

  return (
    <>
      <BookingHistory bookings={bookingsHistory} />
    </>
  );
}

export default BookingHistoryPage;
