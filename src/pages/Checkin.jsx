// CheckinPage.js
import React, { useEffect, useState } from "react";
import CheckinHotel from "../components/CheckinHotel";
import useFetch from "../hooks/useFetch";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Result } from "antd";

function CheckinPage() {
  const token = useSelector((state) => state.auth.token);
  const [bookings, setBookings] = useState([]);

  const {
    data: fetchedBookings,
    loading: bookingLoading,
    error: bookingError,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/user/bookings/reservations");

  useEffect(() => {
    console.log('CheckinPage: useEffect - Fetching bookings. Token:', token);
    if (token) {
      fetchData({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [fetchData, token]);

  useEffect(() => {
    console.log('CheckinPage: useEffect - fetchedBookings updated:', fetchedBookings);
    if (fetchedBookings) {
      setBookings(fetchedBookings);
    }
  }, [fetchedBookings]);

  const handleBookingCancelled = (cancelledBookingId) => {
    console.log('CheckinPage: handleBookingCancelled - ID:', cancelledBookingId);
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === cancelledBookingId ? { ...booking, status: "CANCELLED" } : booking
      )
    );
  };

  useEffect(() => {
    console.log('CheckinPage: bookings state changed:', bookings);
  }, [bookings]);

  if (bookingLoading) {
    console.log('CheckinPage: Loading...');
    return <LoadingSpinner />;
  }

  if (bookingError) {
    console.error('CheckinPage: Error loading bookings:', bookingError);
    return <p>Error loading check-in details: {bookingError}</p>;
  }

  if (!bookings || bookings.length === 0) {
    console.log('CheckinPage: No bookings found.');
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
  }

  console.log('CheckinPage: Rendering with bookings:', bookings);
  return (
    <>
      <CheckinHotel bookings={bookings} onBookingCancelled={handleBookingCancelled} />
    </>
  );
}

export default CheckinPage;