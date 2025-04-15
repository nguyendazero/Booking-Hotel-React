import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const BookingSuccessPage = () => {
  return (
    <div className="mb-5 mt-5">
      <Result
        status="success"
        title="Booking Successful!"
        subTitle="Your hotel room has been booked successfully. We look forward to welcoming you!"
        extra={[
          <Link to="/user/checkin">
            <Button color="purple" variant="solid">
              View Booking Details
            </Button>
          </Link>,

          <Link to="/hotels">
            <Button color="purple" variant="outlined">
              Book Another Hotel
            </Button>
          </Link>,
        ]}
      />
    </div>
  );
};

export default BookingSuccessPage;
