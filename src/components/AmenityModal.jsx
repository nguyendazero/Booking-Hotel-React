import React, { useState, useEffect } from "react";
import { Modal, Button, Input, List, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete";

const AmenityModal = ({
  open,
  onClose,
  hotelId,
  token,
  amenities,
  onAmenitiesUpdated, // Callback khi amenities được thêm hoặc xóa
}) => {
  const [newAmenityName, setNewAmenityName] = useState("");
  const {
    postData: addAmenity,
    loading: addLoading,
    error: addError,
  } = usePost("http://localhost:8080/api/v1/owner/hotel-amenity");
  const {
    deleteData: deleteAmenity,
    loading: deleteLoading,
    error: deleteError,
  } = useDelete();

  const handleAddAmenity = async () => {
    if (newAmenityName.trim() && hotelId) {
      const requestData = {
        hotelId: hotelId,
        nameAmenity: newAmenityName.trim(),
      };
      const response = await addAmenity(requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setNewAmenityName("");
        if (onAmenitiesUpdated) {
          onAmenitiesUpdated();
        }
      } else if (addError) {
        message.error(`Failed to add amenity: ${addError}`);
      }
    } else {
      message.warning("Please enter amenity name.");
    }
  };

  const handleDeleteAmenity = async (amenityId) => {
    if (hotelId && amenityId) {
      const requestData = {
        hotelId: hotelId,
        amenityId: amenityId,
      };
      const response = await deleteAmenity(
        "http://localhost:8080/api/v1/owner/hotel-amenity",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: requestData, // Gửi data trong body cho method DELETE
        }
      );

      if (response) {
        if (onAmenitiesUpdated) {
          onAmenitiesUpdated();
        }
      } else if (deleteError) {
        message.error(`Failed to delete amenity: ${deleteError}`);
      }
    }
  };

  return (
    <Modal
      title="Hotel Amenities"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          disabled={addLoading || deleteLoading}
        >
          Cancel
        </Button>,
      ]}
    >
      <div>
        <Input
          placeholder="Enter new amenity name"
          value={newAmenityName}
          onChange={(e) => setNewAmenityName(e.target.value)}
          suffix={
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleAddAmenity}
              loading={addLoading}
              disabled={!newAmenityName.trim()}
            />
          }
        />
        <List
          loading={!amenities} // Hiển thị loading nếu amenities chưa được fetch
          dataSource={amenities || []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  type="danger"
                  size="small"
                  onClick={() => handleDeleteAmenity(item.id)}
                  loading={deleteLoading}
                >
                  Delete
                </Button>,
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
        {addError && <p className="text-red-500 mt-2">{addError}</p>}
        {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        {(addLoading || deleteLoading) && (
          <LoadingSpinner
            text={addLoading ? "Adding amenity..." : "Deleting amenity..."}
          />
        )}
      </div>
    </Modal>
  );
};

export default AmenityModal;
