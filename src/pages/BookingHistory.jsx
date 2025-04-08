import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import BookingHistory from "../components/BookingHistory";

function BookingHistoryPage() {
  // Get token from Redux
  const token = useSelector((state) => state.auth.token);
  
  const {
    data: bookingsHistory,
    loading: bookingsHistoryLoading,
    error: bookingsHistoryError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/user/bookings");

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
  if (!bookingsHistory || bookingsHistory.length === 0) return <p>No bookings found</p>;

  return (
    <>
      <BookingHistory bookings={bookingsHistory} />
    </>
  );
}

export default BookingHistoryPage;
