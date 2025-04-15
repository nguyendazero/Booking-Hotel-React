import React, { useState, useEffect } from "react";
import { Card } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import moment from "moment";

const chartTitleStyle = {
    marginBottom: 16,
    fontWeight: "bold",
};

const chartValueStyle = {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: "1.2em",
    color: "#1890ff", // Default color
};

function ChartYearlyBookings({ bookings }) {
    const [yearlyBookingsData, setYearlyBookingsData] = useState([]);
    const [totalYearlyBookings, setTotalYearlyBookings] = useState(0);
    const currentYear = moment().year();

    useEffect(() => {
        if (bookings && bookings.length > 0) {
            const monthlyCounts = Array(12).fill(0); // Initialize counts for 12 months
            let totalCount = 0;

            bookings.forEach((booking) => {
                const bookingYear = moment(booking.createDt).year();
                if (bookingYear === currentYear) {
                    const bookingMonth = moment(booking.createDt).month(); // 0-indexed month
                    monthlyCounts[bookingMonth]++;
                    totalCount++;
                }
            });

            const formattedData = monthlyCounts.map((count, index) => ({
                month: moment().month(index).format("MMM"), // Get month name
                bookings: count,
            }));

            setYearlyBookingsData(formattedData);
            setTotalYearlyBookings(totalCount);
        } else {
            setYearlyBookingsData(Array(12).fill(0).map((_, index) => ({
                month: moment().month(index).format("MMM"),
                bookings: 0,
            })));
            setTotalYearlyBookings(0);
        }
    }, [bookings]);

    return (
        <Card>
            <h3 style={chartTitleStyle}>Yearly Bookings ({currentYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={yearlyBookingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
            <p style={{ ...chartValueStyle, color: "#8884d8" }}>
                Total: {totalYearlyBookings} bookings
            </p>
        </Card>
    );
}

export default ChartYearlyBookings;