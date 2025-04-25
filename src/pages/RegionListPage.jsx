import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  List,
  Button,
  Space,
  Modal,
  Input,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import usePost from "../hooks/usePost"; // Import usePost hook
import useDelete from "../hooks/useDelete"; // Import useDelete hook
import usePut from "../hooks/usePut"; // Import usePut hook
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function RegionListPage() {
  const {
    data: regions,
    loading: fetchLoading,
    error: fetchError,
    fetchData,
  } = useFetch(`${API_BASE_URL}/api/v1/public/districts`);
  const token = useSelector((state) => state.auth.token);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newRegionName, setNewRegionName] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [editedRegionName, setEditedRegionName] = useState("");
  const {
    postData: addRegion,
    loading: addingRegion,
    error: addRegionError,
  } = usePost(`${API_BASE_URL}/api/v1/admin/district`);
  const {
    deleteData: deleteRegion,
    loading: deletingRegion,
    error: deleteRegionError,
  } = useDelete();
  const {
    putData: updateRegion,
    loading: updatingRegion,
    error: updateRegionError,
  } = usePut();
  const [regionToDelete, setRegionToDelete] = useState(null);

  useEffect(() => {
    fetchData({
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [fetchData, token]);

  useEffect(() => {
    if (addRegionError) {
      message.error(addRegionError);
    }
  }, [addRegionError]);

  useEffect(() => {
    if (deleteRegionError) {
      message.error(deleteRegionError);
    }
  }, [deleteRegionError]);

  useEffect(() => {
    if (updateRegionError) {
      message.error(updateRegionError);
    }
  }, [updateRegionError]);

  const showAddModal = () => {
    setAddModalVisible(true);
    setNewRegionName("");
  };

  const handleAddModalOk = async () => {
    if (!newRegionName.trim()) {
      message.error("Region name cannot be empty.");
      return;
    }

    const data = { name: newRegionName.trim() };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const responseData = await addRegion(data, config);

    if (responseData) {
      message.success(`Region "${newRegionName.trim()}" added successfully.`);
      setAddModalVisible(false);
      setNewRegionName("");
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const handleAddModalCancel = () => {
    setAddModalVisible(false);
    setNewRegionName("");
  };

  const showEditModal = (region) => {
    setEditingRegion(region);
    setEditedRegionName(region.name);
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    if (!editedRegionName.trim()) {
      message.error("Region name cannot be empty.");
      return;
    }

    if (!editingRegion?.id) return;

    const url = `${API_BASE_URL}/api/v1/admin/district/${editingRegion.id}`;
    const data = { name: editedRegionName.trim() };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await updateRegion(url, data, config);

    if (response?.status === 204) {
      message.success(
        `Region "${editedRegionName.trim()}" updated successfully.`
      );
      setEditModalVisible(false);
      setEditingRegion(null);
      setEditedRegionName("");
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
    setEditingRegion(null);
    setEditedRegionName("");
  };

  const handleDeleteConfirm = (id) => {
    setRegionToDelete(id);
    deleteRegionHandler(id);
  };

  const deleteRegionHandler = async (id) => {
    const url = `${API_BASE_URL}/api/v1/admin/district/${id}`;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await deleteRegion(url, config);

    if (response?.status === 204) {
      message.success(`Region with ID ${id} deleted successfully.`);
      fetchData({ headers: { Authorization: `Bearer ${token}` } });
    }
    setRegionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setRegionToDelete(null);
  };

  if (fetchLoading) {
    return <LoadingSpinner />;
  }

  if (fetchError) {
    return (
      <p className="text-red-500 font-semibold">
        Error fetching regions: {fetchError}
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-lime-50 to-green-100 rounded-md shadow-lg">
      <Breadcrumb className="mb-6">
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-lime-500">Admin</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-gray-600 hover:text-lime-500">Regions</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="text-green-700 font-semibold">Manage</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-green-800">
          Region Management
        </h1>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={showAddModal}
          loading={addingRegion}
        >
          Add New Region
        </Button>
      </div>
      {regions && regions.length > 0 ? (
        <List
          className="divide-y divide-green-200"
          dataSource={regions}
          renderItem={(item) => (
            <List.Item className="py-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">{item.name}</span>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  size="small"
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded shadow-md"
                  onClick={() => showEditModal(item)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title={`Are you sure you want to delete "${item.name}"?`}
                  onConfirm={() => handleDeleteConfirm(item.id)}
                  onCancel={handleDeleteCancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    size="small"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded shadow-md"
                    loading={deletingRegion && regionToDelete === item.id}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 italic">No regions available.</p>
      )}

      <Modal
        title="Add New Region"
        open={addModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        confirmLoading={addingRegion}
      >
        <Form>
          <Form.Item label="Region Name:">
            <Input
              value={newRegionName}
              onChange={(e) => setNewRegionName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Edit Region`}
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        confirmLoading={updatingRegion}
      >
        <Form>
          <Form.Item label="Region Name:">
            <Input
              value={editedRegionName}
              onChange={(e) => setEditedRegionName(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default RegionListPage;
