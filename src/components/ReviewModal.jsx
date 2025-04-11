import React, { useEffect } from "react";
import { Star } from "lucide-react";
import { Button, Modal, Avatar, List } from "antd";
import useFetch from "../hooks/useFetch";

const ReviewModal = ({ open, onClose, hotelId }) => {
  const {
    data: reviews,
    loading,
    error,
    fetchData: fetchReviews,
  } = useFetch(
    hotelId
      ? `http://localhost:8080/api/v1/public/hotel/${hotelId}/ratings`
      : null
  );

  useEffect(() => {
    if (open && hotelId) {
      fetchReviews();
    }
  }, [open, hotelId, fetchReviews]);

  return (
    <Modal
      title="Hotel Reviews"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading reviews...
        </div>
      )}
      {error && (
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading reviews: {error}
        </div>
      )}
      {reviews && reviews.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item
              style={{
                borderBottom: "1px solid #e8e8e8",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <List.Item.Meta
                avatar={<Avatar size={48} src={review.account?.avatar} />}
                title={
                  <span style={{ fontWeight: "bold" }}>
                    {review.account?.fullName}
                  </span>
                }
                description={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    {Array.from({ length: review.stars }).map((_, index) => (
                      <Star
                        key={`star-filled-${index}`}
                        fill="#facc15"
                        className="text-yellow-500"
                        size={16}
                        style={{ marginRight: "3px" }}
                      />
                    ))}
                    {Array.from({ length: 5 - review.stars }).map(
                      (_, index) => (
                        <Star
                          key={`star-empty-${index}`}
                          className="text-gray-400"
                          size={16}
                          style={{ marginRight: "3px" }}
                        />
                      )
                    )}
                    <span
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.9em",
                        color: "#8c8c8c",
                      }}
                    >
                      {new Date(review.createDt).toLocaleDateString()}
                    </span>
                  </div>
                }
              />
              <p>{review.content}</p>
              {review.images && review.images.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px",
                    overflowX: "auto",
                  }}
                >
                  {review.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.imageUrl}
                      alt="Review Image"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              )}
            </List.Item>
          )}
        />
      ) : (
        !loading &&
        !error &&
        open &&
        hotelId && (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#8c8c8c" }}
          >
            No reviews available for this hotel yet.
          </div>
        )
      )}
    </Modal>
  );
};

export default ReviewModal;
