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

const Statistic = () => {
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Giả định dữ liệu booking từ API hoặc state
  const sampleBookings = [
    { id: 1, checkIn: "2025-01-15", checkOut: "2025-01-20", totalPrice: 500 },
    { id: 2, checkIn: "2025-01-25", checkOut: "2025-01-28", totalPrice: 300 },
    { id: 3, checkIn: "2025-02-05", checkOut: "2025-02-10", totalPrice: 600 },
    { id: 4, checkIn: "2025-02-18", checkOut: "2025-02-22", totalPrice: 450 },
    { id: 5, checkIn: "2025-03-01", checkOut: "2025-03-07", totalPrice: 700 },
    { id: 6, checkIn: "2025-03-12", checkOut: "2025-03-15", totalPrice: 350 },
    { id: 7, checkIn: "2025-04-02", checkOut: "2025-04-05", totalPrice: 400 },
    { id: 8, checkIn: "2025-04-22", checkOut: "2025-04-28", totalPrice: 800 },
    // ... Thêm dữ liệu booking khác
  ];

  useEffect(() => {
    // Giả lập gọi API để lấy dữ liệu booking
    setTimeout(() => {
      if (sampleBookings) {
        const bookingsByMonth = {};
        const revenueByMonth = {};
        let totalRevenueCalculated = 0;
        let totalBookingsCalculated = 0;

        sampleBookings.forEach((booking) => {
          const month = new Date(booking.checkIn).getMonth() + 1; // Tháng 1 là 1
          const year = new Date(booking.checkIn).getFullYear();
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
        setError("Failed to fetch booking data.");
        setLoading(false);
      }
    }, 1500); // Thời gian giả lập API call
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu thống kê...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Card>
            <AntdStatistic
              title="Tổng Số Lượt Đặt Phòng"
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
              title="Tổng Doanh Thu"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix=" VNĐ"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Số Lượt Đặt Phòng Theo Tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" name="Lượt Đặt Phòng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh Thu Theo Tháng">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis formatter={(value) => `${value} VNĐ`} />
                <Tooltip formatter={(value) => `${value} VNĐ`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Doanh Thu" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistic;
