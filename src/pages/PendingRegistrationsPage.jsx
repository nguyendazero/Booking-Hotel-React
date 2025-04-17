import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Tag } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function PendingRegistrationsPage() {
  const { data: pendingRegistrations, loading, error, fetchData } = useFetch(
    "http://localhost:8080/api/v1/admin/owner-registrations"
  );
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <p className="text-red-600 font-bold">
        Error fetching pending registrations: {error}
      </p>
    );
  }

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360, background: "#fff" }}
    >
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Registrations</Breadcrumb.Item>
        <Breadcrumb.Item>Pending</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Pending Hotel Owner Registrations</h1>
      {pendingRegistrations && pendingRegistrations.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={pendingRegistrations}
          renderItem={(registration) => (
            <List.Item>
              <Card
                title={`Registration ID: ${registration.id}`}
                style={{ width: "100%" }}
              >
                <p>
                  <strong>Full Name:</strong> {registration.account.fullName}
                </p>
                <p>
                  <strong>Username:</strong> {registration.account.username}
                </p>
                <p>
                  <strong>Email:</strong> {registration.account.email}
                </p>
                <p>
                  <strong>Phone:</strong> {registration.account.phone}
                </p>
                <p>
                  <strong>Status:</strong> <Tag color="yellow">{registration.status}</Tag>
                </p>
                {/* You can add buttons here to approve/reject the registration */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No pending hotel owner registrations found.</p>
      )}
    </div>
  );
}

export default PendingRegistrationsPage;