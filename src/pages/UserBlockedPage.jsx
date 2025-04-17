import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  List,
  Card,
  Avatar,
  Tag,
  Button,
  message,
  Popconfirm,
} from "antd";
import { UnlockOutlined } from "@ant-design/icons";
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
  const [unblocking, setUnblocking] = useState(false);
  const [userToUnblock, setUserToUnblock] = useState(null);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  const handleUnblock = async (userId) => {
    setUserToUnblock(userId);
    setUnblocking(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/admin/unblock-account/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        message.success("Account has been unblocked successfully.");
        fetchData({
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Refetch user data
      } else {
        const errorData = await response.json();
        message.error(
          `Failed to unblock account: ${
            errorData?.message || response.statusText
          }`
        );
      }
    } catch (error) {
      message.error(`Failed to unblock account: ${error.message}`);
    } finally {
      setUnblocking(false);
      setUserToUnblock(null);
    }
  };

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
                actions={[
                  <Popconfirm
                    title="Are you sure you want to unblock this account?"
                    onConfirm={() => handleUnblock(user.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      key="unblock"
                      icon={<UnlockOutlined />}
                      className="text-green-500 hover:text-green-700"
                      loading={unblocking && userToUnblock === user.id}
                    >
                      Unblock
                    </Button>
                  </Popconfirm>,
                ]}
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
                {user.blockReason && (
                  <p className="text-gray-700">
                    <strong className="text-blue-500">Block Reason:</strong>{" "}
                    <span className="font-medium">{user.blockReason}</span>
                  </p>
                )}
                <Tag color="error" className="mt-2 font-semibold">
                  Blocked
                </Tag>
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
