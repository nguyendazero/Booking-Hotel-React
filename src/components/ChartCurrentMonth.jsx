import React, { useState, useEffect } from "react";
import { Card } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

function ChartCurrentMonth({ bookings, type }) {
  const [currentMonthData, setCurrentMonthData] = useState([]);
  const [currentMonthValue, setCurrentMonthValue] = useState(0);
  const currentMonthYear = moment().format("MM-YYYY");

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const now = moment();
      const currentMonthYear = now.format("YYYY-MM");
      let revenue = 0;
      let bookingCount = 0;

      bookings.forEach((booking) => {
        const bookingMonthYear = moment(booking.createDt).format("YYYY-MM");
        if (bookingMonthYear === currentMonthYear) {
          revenue += booking.totalPrice;
          bookingCount++;
        }
      });

      if (type === "revenue") {
        setCurrentMonthData([{ name: currentMonthYear, value: revenue }]);
        setCurrentMonthValue(revenue);
      } else if (type === "bookings") {
        setCurrentMonthData([{ name: currentMonthYear, value: bookingCount }]);
        setCurrentMonthValue(bookingCount);
      }
    } else {
      setCurrentMonthData([]);
      setCurrentMonthValue(0);
    }
  }, [bookings, type]);

  const title =
    type === "revenue"
      ? `Monthly Revenue for ${currentMonthYear}`
      : `Monthly bookings for ${currentMonthYear}`;
  const valueText =
    type === "revenue"
      ? `$${currentMonthValue.toFixed(2)}`
      : `${currentMonthValue} bookings`;
  const barColor = type === "revenue" ? "#1890ff" : "#52c41a";
  const yAxisLabel = type === "revenue" ? "Revenue ($)" : "bookings";

  return (
    <Card>
      <h3 style={chartTitleStyle}>{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={currentMonthData}
          margin={{ top: 15, right: 30, left: 45, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              offset: -15,
              style: { fill: "#000" },
            }}
          />
          <Tooltip
            formatter={(value) =>
              type === "revenue" ? `$${value.toFixed(2)}` : `${value} lượt`
            }
          />
          <Bar dataKey="value" fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ ...chartValueStyle, color: barColor }}>{valueText}</p>
    </Card>
  );
}

export default ChartCurrentMonth;
