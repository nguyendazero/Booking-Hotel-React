import React, { useEffect } from "react";
import CheckinHotel from "../components/CheckinHotel";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";

function CheckinPage() {
  // Get token from Redux
  const token = useSelector((state) => state.auth.token);
  
  const {
    data: bookings,
    loading: bookingLoading,
    error: bookingError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/user/bookings/reservations");

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

  if (bookingLoading) return <LoadingSpinner />;
  if (bookingError)
    return <p>Error loading check-in details: {bookingError}</p>;
  if (!bookings || bookings.length === 0) return <p>No bookings found</p>;

  return (
    <>
      <CheckinHotel bookings={bookings} />
    </>
  );
}

export default CheckinPage;
