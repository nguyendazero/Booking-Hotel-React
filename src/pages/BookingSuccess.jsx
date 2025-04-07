import React from 'react';
import { Button, Card } from 'antd'; // Sử dụng Ant Design để xây dựng giao diện

const BookingSuccessPage = () => {
    // Dữ liệu đặt phòng
    const bookingData = {
        roomImage: "https://example.com/room.jpg", // Thay thế bằng URL của hình ảnh phòng
        roomDescription: "Hotel room in Tokyo, Japan",
        hotelLocation: "Tokyo, Japan",
        roomName: "The Lounge & Bar",
        rating: 4.5,
        checkInDate: "Aug 12",
        checkOutDate: "Aug 16, 2021",
        guests: "3",
        bookingCode: "#222-333-111",
        totalPrice: 199,
        paymentMethod: "Credit card",
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Congratulations 🎉</h1>
            <h2>Your booking</h2>

            <Card hoverable style={{ width: 400, margin: '20px auto' }}>
                <img 
                    alt="room" 
                    src={bookingData.roomImage} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                />
                <h3>{bookingData.roomName}</h3>
                <p>{bookingData.roomDescription}</p>
                <p>{bookingData.hotelLocation}</p>
                <p>{bookingData.rating} ★</p>
                <p>{bookingData.guests} Guests</p>
                <p>Date: {bookingData.checkInDate} - {bookingData.checkOutDate}</p>
            </Card>

            <h3>Booking detail</h3>
            <p>Booking code: {bookingData.bookingCode}</p>
            <p>Date: {bookingData.checkInDate}</p>
            <p>Total: ${bookingData.totalPrice}</p>
            <p>Payment method: {bookingData.paymentMethod}</p>

            <Button type="primary" style={{ marginTop: '20px' }}>
                Explore more stays
            </Button>
        </div>
    );
};

export default BookingSuccessPage;