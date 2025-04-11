import React, { useState, useEffect } from "react";
import { Modal, Button, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import useDelete from "../hooks/useDelete";

const ImageModal = ({
  open,
  onClose,
  images,
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

  useEffect(() => {
    if (!open) {
      setDeleteMode(false);
      setSelectedImageIdsToDelete([]);
    }
  }, [open]);

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
      const imageUrl = `http://localhost:8080/api/v1/owner/hotel/${currentHotelId}/images?${selectedImageIdsToDelete
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
        <Button key="deleteMode" icon={<DeleteOutlined />} onClick={handleToggleDeleteMode} disabled={addingImages || loading || deleteLoading || images.length === 0}>
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
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {selectedFileCount > 0 && (
            <p className="mb-2">{selectedFileCount} image(s) selected for adding.</p>
          )}
          {deleteMode && images.length > 0 && (
            <p className="mb-2">Select images to delete.</p>
          )}
          {images.length === 0 && !loading && !deleteMode && (
            <p>No images available for this hotel.</p>
          )}
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.imageUrl}
                  alt={`Hotel Image ${image.id}`}
                  className="w-[150px] h-[100px] object-cover"
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
          {deleteError && <p className="text-red-500 mt-2">{deleteError}</p>}
        </div>
      )}
      {deleteLoading && <LoadingSpinner text="Deleting images..." />}
    </Modal>
  );
};

export default ImageModal;