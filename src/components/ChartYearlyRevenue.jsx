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
  color: "#52c41a", // Different color for revenue
};

function ChartYearlyRevenue({ bookings }) {
  const [yearlyRevenueData, setYearlyRevenueData] = useState([]);
  const [totalYearlyRevenue, setTotalYearlyRevenue] = useState(0);
  const currentYear = moment().year();

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const monthlyRevenue = Array(12).fill(0); // Initialize revenue for 12 months
      let totalRevenue = 0;

      bookings.forEach((booking) => {
        const bookingYear = moment(booking.createDt).year();
        if (bookingYear === currentYear) {
          const bookingMonth = moment(booking.createDt).month(); // 0-indexed month
          monthlyRevenue[bookingMonth] += booking.totalPrice;
          totalRevenue += booking.totalPrice;
        }
      });

      const formattedData = monthlyRevenue.map((revenue, index) => ({
        month: moment().month(index).format("MMM"), // Get month name
        revenue: revenue,
      }));

      setYearlyRevenueData(formattedData);
      setTotalYearlyRevenue(totalRevenue);
    } else {
      setYearlyRevenueData(
        Array(12)
          .fill(0)
          .map((_, index) => ({
            month: moment().month(index).format("MMM"),
            revenue: 0,
          }))
      );
      setTotalYearlyRevenue(0);
    }
  }, [bookings]);

  return (
    <Card>
      <h3 style={chartTitleStyle}>Yearly Revenue ({currentYear})</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={yearlyRevenueData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />{" "}
          {/* Format as currency */}
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />{" "}
          {/* Format in tooltip */}
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#52c41a"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p style={{ ...chartValueStyle, color: "#52c41a" }}>
        Total: ${totalYearlyRevenue.toFixed(2)}
      </p>
    </Card>
  );
}

export default ChartYearlyRevenue;
