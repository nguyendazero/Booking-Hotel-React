import React, { useState, useEffect } from "react";
import { Breadcrumb, List } from "antd";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";

function ConfigListPage() {
  const { data: configs, loading, error, fetchData } = useFetch(
    "http://localhost:8080/api/v1/public/configs"
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
    return <p className="text-red-600 font-bold">Error fetching configs: {error}</p>;
  }

  return (
    <div className="site-layout-background" style={{ padding: 24, minHeight: 360, background: "#fff" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Configs</Breadcrumb.Item>
        <Breadcrumb.Item>Config List</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Config List</h1>
      {configs && configs.length > 0 ? (
        <List
          bordered
          dataSource={configs}
          renderItem={(item) => (
            <List.Item>
              <div>
                <strong>Name:</strong> {item.name}
              </div>
              <div>
                <strong>Value:</strong> {item.value}
              </div>
            </List.Item>
          )}
        />
      ) : (
        <p>No configs available.</p>
      )}
    </div>
  );
}

export default ConfigListPage;