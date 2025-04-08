import React, { useEffect } from "react";
import CheckinHotel from "../components/CheckinHotel";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Result } from "antd"; // Nhập Result và Button từ antd

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
  if (!bookings || bookings.length === 0)
    return (
      <div className="mt-5 mb-5">
        <Result
          status="info"
          title="No Bookings Found"
          subTitle="It looks like there are no bookings in your account. Please make a reservation to see it here."
          extra={
            <Link to="/hotels">
              <Button type="primary" key="newBooking">
                Find Hotels
              </Button>
            </Link>
          }
        />
      </div>
    );

  return (
    <>
      <CheckinHotel bookings={bookings} />
    </>
  );
}

export default CheckinPage;
