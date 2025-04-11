import React, { useState, useRef, useEffect } from "react";
import {
  Edit,
  Trash,
  Star,
  MapPin,
  Eye,
  Image,
  Percent,
  ListChecks,
  CalendarDays,
} from "lucide-react";
import { Button, message } from "antd";
import useFetch from "../hooks/useFetch";
import usePost from "../hooks/usePost";
import ImageModal from "../components/ImageModal";
import AmenityModal from "../components/AmenityModal";
import DiscountModal from "../components/DiscountModal";
import ReviewModal from "../components/ReviewModal";
import { useSelector } from "react-redux";

const HotelManagement = ({ hotels }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAmenityModalVisible, setIsAmenityModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false); // New state for review modal
  const [currentHotelId, setCurrentHotelId] = useState(null);
  const imageInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [addingImages, setAddingImages] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const {
    data: imagesData,
    loading: imagesLoading,
    fetchData: fetchImages,
  } = useFetch(
    currentHotelId
      ? `http://localhost:8080/api/v1/public/hotel/${currentHotelId}/images`
      : null
  );

  const {
    postData: addHotelImages,
    loading: addImagesLoading,
    error: addImagesError,
  } = usePost(
    currentHotelId
      ? `http://localhost:8080/api/v1/owner/hotel/${currentHotelId}/images`
      : null
  );

  const { data: amenitiesData, fetchData: fetchAmenities } = useFetch(
    currentHotelId
      ? `http://localhost:8080/api/v1/public/hotel/${currentHotelId}/amenities`
      : null
  );

  const { data: discountsData, fetchData: fetchDiscounts } = useFetch(
    currentHotelId
      ? `http://localhost:8080/api/v1/public/hotel/${currentHotelId}/discounts`
      : null
  );

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star key={i} fill="#facc15" className="text-yellow-500" size={16} />
        );
      } else {
        stars.push(<Star key={i} className="text-gray-400" size={16} />);
      }
    }
    return <div className="flex items-center">{stars}</div>;
  };

  const handleShowImages = (hotelId) => {
    setCurrentHotelId(hotelId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setCurrentHotelId(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    setSelectedFiles([]);
    setAddingImages(false);
  };

  const handleAddImagesClick = () => {
    imageInputRef.current.click();
  };

  const handleImageSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleConfirmAddImages = async () => {
    if (currentHotelId && selectedFiles.length > 0) {
      setAddingImages(true);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("imageUrls", file);
      });

      const responseData = await addHotelImages(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData) {
        message.success("Images added successfully");
        fetchImages();
        setSelectedFiles([]);
      } else if (addImagesError) {
        message.error(`Failed to add images: ${addImagesError}`);
      }

      setAddingImages(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } else if (selectedFiles.length === 0) {
      message.warning("Please select images to add.");
    }
  };

  const handleImagesDeleted = () => {
    fetchImages();
  };

  const handleShowAmenities = (hotelId) => {
    setCurrentHotelId(hotelId);
    setIsAmenityModalVisible(true);
  };

  const handleCloseAmenityModal = () => {
    setIsAmenityModalVisible(false);
    setCurrentHotelId(null);
  };

  const handleAmenitiesUpdated = () => {
    fetchAmenities(); // Fetch lại amenities sau khi thêm hoặc xóa
  };

  const handleShowDiscounts = (hotelId) => {
    setCurrentHotelId(hotelId);
    setIsDiscountModalVisible(true);
  };

  const handleCloseDiscountModal = () => {
    setIsDiscountModalVisible(false);
    setCurrentHotelId(null);
  };

  const handleDiscountsUpdated = () => {
    fetchDiscounts(); // Fetch lại discounts sau khi thêm hoặc xóa
  };

  const handleShowReviews = (hotelId) => {
    setCurrentHotelId(hotelId);
    setIsReviewModalVisible(true);
  };

  const handleCloseReviews = () => {
    setIsReviewModalVisible(false);
    setCurrentHotelId(null);
  };

  useEffect(() => {
    if (isModalVisible && currentHotelId) {
      fetchImages();
    }
  }, [isModalVisible, currentHotelId, fetchImages]);

  useEffect(() => {
    if (isAmenityModalVisible && currentHotelId) {
      fetchAmenities();
    }
  }, [isAmenityModalVisible, currentHotelId, fetchAmenities]);

  useEffect(() => {
    if (isDiscountModalVisible && currentHotelId) {
      fetchDiscounts();
    }
  }, [isDiscountModalVisible, currentHotelId, fetchDiscounts]);

  return (
    <div className="container mx-auto mt-8 px-16 max-w-7xl">
      <div className="flex justify-end mb-4">
        <button
          className={`bg-purple-500 hover:bg-purple-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1`}
        >
          Add New Hotel
        </button>
      </div>
      <div className="space-y-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-center">
              <img
                src={hotel.highLightImageUrl}
                alt={hotel.name}
                className="w-100 h-60 object-cover rounded-l-lg"
              />
            </div>
            <div className="w-2/4 px-6 pb-6 flex flex-col justify-between">
              <div className="p-4 rounded-md">
                <h1 className="text-2xl font-bold text-purple-700 mb-3">
                  {hotel.name}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="mr-2 text-green-600" size={20} />
                  <span className="font-bold text-xl">
                    {hotel.streetAddress}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="font-bold mr-2 text-sm">Price:</span>
                  <span className="text-sm">
                    ${hotel.pricePerDay}
                    {hotel.discount && (
                      <span className="text-xs text-green-500 ml-1">
                        (-{hotel.discount?.rate}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <span className="font-bold mr-2 text-sm">Rating:</span>
                  <div className="ml-0.5">
                    {renderRatingStars(hotel.rating)}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">
                    ({hotel.reviews} reviews)
                  </span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {hotel.description}
                </p>
              </div>
              {/* Edit and Delete Buttons */}
              <div className="flex justify-start items-center space-x-2 ml-4">
                <Button
                  color="primary"
                  icon={<Edit size={16} />}
                  variant="solid"
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  icon={<Trash size={16} />}
                >
                  Delete
                </Button>
              </div>
            </div>
            {/* Action Buttons (Vertical) */}
            <div className="w-1/4 p-4 flex flex-col justify-center items-end space-y-2">
              <Button
                color="danger"
                variant="solid"
                className="w-32"
                icon={<Eye size={16} />}
                onClick={() => handleShowReviews(hotel.id)}
              >
                View Review
              </Button>
              <Button
                color="purple"
                variant="solid"
                className="w-32"
                icon={<Percent size={16} />}
                onClick={() => handleShowDiscounts(hotel.id)}
              >
                View Discount
              </Button>
              <Button
                color="primary"
                variant="solid"
                className="w-32"
                icon={<Image size={16} />}
                onClick={() => handleShowImages(hotel.id)}
              >
                View Images
              </Button>
              <Button
                color="cyan"
                variant="solid"
                className="w-32"
                icon={<ListChecks size={16} />}
                onClick={() => handleShowAmenities(hotel.id)}
              >
                View Amenities
              </Button>
              <Button
                color="pink"
                variant="solid"
                className="w-32"
                icon={<CalendarDays size={16} />}
              >
                View Booking
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Amenities Modal */}
      <AmenityModal
        open={isAmenityModalVisible}
        onClose={handleCloseAmenityModal}
        hotelId={currentHotelId}
        token={token}
        amenities={amenitiesData}
        onAmenitiesUpdated={handleAmenitiesUpdated}
      />
      {/* Discount Modal */}
      <DiscountModal
        open={isDiscountModalVisible}
        onClose={handleCloseDiscountModal}
        hotelId={currentHotelId}
        token={token}
        discounts={discountsData}
        onDiscountsUpdated={handleDiscountsUpdated}
      />
      {/* Image Modal */}
      <ImageModal
        open={isModalVisible}
        onClose={handleCloseModal}
        images={imagesData || []}
        loading={imagesLoading}
        onAddImagesClick={handleAddImagesClick}
        addingImages={addImagesLoading || addingImages}
        selectedFileCount={selectedFiles.length}
        onConfirmAddImages={handleConfirmAddImages}
        currentHotelId={currentHotelId}
        token={token}
        onImagesDeleted={handleImagesDeleted}
      />
      {/* Review Modal */}
      <ReviewModal
        open={isReviewModalVisible}
        onClose={handleCloseReviews}
        hotelId={currentHotelId}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={imageInputRef}
        onChange={handleImageSelect}
      />
    </div>
  );
};

export default HotelManagement;
