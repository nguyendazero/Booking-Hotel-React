import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Tag } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function UserListPage() {
  const { data: users, loading, error, fetchData } = useFetch(
    "http://localhost:8080/api/v1/admin/accounts"
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
      <p className="text-red-600 font-bold">Error fetching users: {error}</p>
    );
  }

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, minHeight: 360, background: "#fff" }}
    >
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Users</Breadcrumb.Item>
        <Breadcrumb.Item>User List</Breadcrumb.Item>
      </Breadcrumb>
      <h1>User List</h1>
      {users && users.length > 0 ? (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user.id}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={user.avatar} size="small" style={{ marginRight: 8 }} />
                    {user.fullName}
                  </div>
                }
              >
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                {user.roles && user.roles.length > 0 && (
                  <p>
                    <strong>Roles:</strong>{" "}
                    {user.roles.map((role) => (
                      <Tag key={role}>{role}</Tag>
                    ))}
                  </p>
                )}
                {/* You can add more user details or actions here */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default UserListPage;