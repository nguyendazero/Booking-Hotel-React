import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox, Pagination } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import useDelete from "../hooks/useDelete";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageModal = ({
  open,
  onClose,
  images: allImages,
  loading,
  onAddImagesClick,
  addingImages,
  selectedFileCount,
  onConfirmAddImages,
  currentHotelId,
  token,
  onImagesDeleted,
}) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedImageIdsToDelete, setSelectedImageIdsToDelete] = useState([]);
  const { deleteData: deleteHotelImages, loading: deleteLoading, error: deleteError } = useDelete();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Số lượng ảnh trên mỗi trang
  const [paginatedImages, setPaginatedImages] = useState([]);

  useEffect(() => {
    if (!open) {
      setDeleteMode(false);
      setSelectedImageIdsToDelete([]);
      setCurrentPage(1); // Reset trang khi modal đóng
    } else if (open) {
      setCurrentPage(1); // Reset trang khi modal mở
    }
  }, [open]);

  useEffect(() => {
    if (allImages) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedImages(allImages.slice(startIndex, endIndex));
    }
  }, [allImages, currentPage, itemsPerPage]);

  const handleToggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedImageIdsToDelete([]);
  };

  const handleImageSelectToDelete = (imageId, checked) => {
    if (checked) {
      setSelectedImageIdsToDelete([...selectedImageIdsToDelete, imageId]);
    } else {
      setSelectedImageIdsToDelete(selectedImageIdsToDelete.filter((id) => id !== imageId));
    }
  };

  const handleConfirmDeleteImages = async () => {
    if (currentHotelId && selectedImageIdsToDelete.length > 0) {
      const imageUrl = `${API_BASE_URL}/api/v1/owner/hotel/${currentHotelId}/images?${selectedImageIdsToDelete
        .map((id) => `imageIds=${id}`)
        .join("&")}`;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await deleteHotelImages(imageUrl, config);

      if (response) {
        setDeleteMode(false);
        setSelectedImageIdsToDelete([]);
        if (onImagesDeleted) {
          onImagesDeleted(); // Gọi callback để component cha fetch lại dữ liệu
        }
      } else if (deleteError) {
        message.error(`Failed to delete images: ${deleteError}`);
      }
    } else {
      message.warning("Please select images to delete.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const footerButtons = () => {
    if (deleteMode) {
      return [
        <Button key="cancel" onClick={handleToggleDeleteMode} disabled={deleteLoading}>
          Cancel
        </Button>,
        <Button
          key="delete"
          type="danger"
          loading={deleteLoading}
          onClick={handleConfirmDeleteImages}
          disabled={selectedImageIdsToDelete.length === 0 || deleteLoading}
        >
          Delete Selected
        </Button>,
      ];
    } else {
      return [
        <Button key="back" onClick={onClose} disabled={addingImages || deleteLoading}>
          Cancel
        </Button>,
        <Button key="deleteMode" icon={<DeleteOutlined />} onClick={handleToggleDeleteMode} disabled={addingImages || loading || deleteLoading || allImages?.length === 0}>
          Delete Images
        </Button>,
        selectedFileCount > 0 ? (
          <Button
            key="confirm"
            type="primary"
            loading={addingImages}
            onClick={onConfirmAddImages}
            disabled={addingImages || deleteLoading}
          >
            Add {selectedFileCount} Image(s)
          </Button>
        ) : (
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddImagesClick}
            disabled={addingImages || deleteLoading}
          >
            Select Images
          </Button>
        ),
      ];
    }
  };

  return (
    <Modal
      title="Images"
      open={open}
      onCancel={onClose}
      footer={footerButtons()}
      width={800} // Tăng kích thước modal để hiển thị nhiều ảnh hơn trên một hàng (tùy chỉnh)
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {selectedFileCount > 0 && (
            <p className="mb-2">{selectedFileCount} image(s) selected for adding.</p>
          )}
          {deleteMode && allImages?.length > 0 && (
            <p className="mb-2">Select images to delete.</p>
          )}
          {allImages?.length === 0 && !loading && !deleteMode && (
            <p>No images available for this hotel.</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {paginatedImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.imageUrl}
                  alt={`Hotel Image ${image.id}`}
                  className="w-full h-[150px] object-cover rounded" // Sử dụng w-full để ảnh vừa với container
                />
                {deleteMode && (
                  <Checkbox
                    className="absolute top-1 right-1"
                    onChange={(e) => handleImageSelectToDelete(image.id, e.target.checked)}
                    checked={selectedImageIdsToDelete.includes(image.id)}
                  />
                )}
              </div>
            ))}
          </div>
          {allImages?.length > itemsPerPage && (
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={allImages.length}
              onChange={handlePageChange}
              style={{ marginTop: 16, textAlign: "center" }}
            />
          )}
          {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        </div>
      )}
      {deleteLoading && <LoadingSpinner text="Deleting images..." />}
    </Modal>
  );
};

export default ImageModal;