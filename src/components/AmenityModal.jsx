import React, { useState, useEffect } from "react";
import { Modal, Button, Input, List, message, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete";

const AmenityModal = ({
  open,
  onClose,
  hotelId,
  token,
  amenities: allAmenities, // Đổi tên prop để tránh nhầm lẫn
  onAmenitiesUpdated, // Callback khi amenities được thêm hoặc xóa
}) => {
  const [newAmenityName, setNewAmenityName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng amenities trên mỗi trang
  const [paginatedAmenities, setPaginatedAmenities] = useState([]);

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

  useEffect(() => {
    if (open) {
      setCurrentPage(1); // Reset trang khi modal mở
    }
  }, [open]);

  useEffect(() => {
    if (allAmenities) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedAmenities(allAmenities.slice(startIndex, endIndex));
    }
  }, [allAmenities, currentPage, itemsPerPage]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Modal
      title="Amenities"
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
          loading={!allAmenities} // Hiển thị loading nếu amenities chưa được fetch
          dataSource={paginatedAmenities}
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
        {allAmenities && allAmenities.length > itemsPerPage && (
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={allAmenities.length}
            onChange={handlePageChange}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        )}
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