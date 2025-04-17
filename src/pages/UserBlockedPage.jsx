import React, { useState, useEffect } from "react";
import { Breadcrumb, List, Card, Avatar, Tag } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function UserBlockedPage() {
  const {
    data: users,
    loading,
    error,
    fetchData,
  } = useFetch("http://localhost:8080/api/v1/admin/accounts?isBlocked=true");
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
      <p className="text-red-500 font-semibold">
        Error fetching blocked users: {error}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-md shadow-md">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-red-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-red-500">Users</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-red-700 font-semibold">Blocked</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h1 className="text-2xl font-bold text-red-700 mb-6">Blocked Users</h1>
      {users && users.length > 0 ? (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user.id}>
              <Card
                className="rounded-md shadow-md hover:shadow-lg transition duration-300 border-red-300"
                title={
                  <div className="flex items-center">
                    <Avatar
                      src={user.avatar}
                      size="small"
                      className="mr-3 bg-red-500 text-white"
                    />
                    <span className="text-lg font-semibold text-gray-800">
                      {user.fullName}
                    </span>
                  </div>
                }
              >
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Username:</strong>{" "}
                  <span className="font-medium">{user.username}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Email:</strong>{" "}
                  <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong className="text-blue-500">Phone:</strong>{" "}
                  <span className="font-medium">{user.phone}</span>
                </p>
                {user.roles && user.roles.length > 0 && (
                  <p className="text-gray-700">
                    <strong className="text-blue-500">Roles:</strong>{" "}
                    {user.roles.map((role) => (
                      <Tag
                        key={role}
                        className="mr-1 font-medium"
                        style={{
                          color: "#dc2626",
                          backgroundColor: "#fee2e2",
                          borderColor: "#fca5a5",
                        }}
                      >
                        {role}
                      </Tag>
                    ))}
                  </p>
                )}
                <Tag color="error" className="mt-2 font-semibold">
                  Blocked
                </Tag>
                {/* You can add more details or actions (like unblock) here */}
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No blocked users found.</p>
      )}
    </div>
  );
}

export default UserBlockedPage;
