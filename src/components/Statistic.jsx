import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Row, Col, Statistic as AntdStatistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Statistic = ({ bookings }) => {
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookings) {
      const bookingsByMonth = {};
      const revenueByMonth = {};
      let totalRevenueCalculated = 0;
      let totalBookingsCalculated = 0;

      bookings.forEach((booking) => {
        const month = new Date(booking.startDate).getMonth() + 1;
        const year = new Date(booking.startDate).getFullYear();
        const monthYear = `${year}-${month < 10 ? "0" + month : month}`;

        bookingsByMonth[monthYear] = (bookingsByMonth[monthYear] || 0) + 1;
        revenueByMonth[monthYear] =
          (revenueByMonth[monthYear] || 0) + booking.totalPrice;
        totalRevenueCalculated += booking.totalPrice;
        totalBookingsCalculated++;
      });

      const bookingsData = Object.keys(bookingsByMonth)
        .sort()
        .map((month) => ({
          month,
          bookings: bookingsByMonth[month],
        }));

      const revenueData = Object.keys(revenueByMonth)
        .sort()
        .map((month) => ({
          month,
          revenue: revenueByMonth[month],
        }));

      setMonthlyBookings(bookingsData);
      setMonthlyRevenue(revenueData);
      setTotalRevenue(totalRevenueCalculated);
      setTotalBookings(totalBookingsCalculated);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [bookings]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card>
            <AntdStatistic
              title="Total Bookings"
              value={totalBookings}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <AntdStatistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix=" USD"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Number of Bookings Per Month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Revenue By Month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis formatter={(value) => `${value} USD`} />
                <Tooltip formatter={(value) => `${value} USD`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistic;
