import { useState } from "react";
import axios from "axios";

const usePut = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (data, config = {}, urlOverride) => {
    setLoading(true);
    setError(null);

    try {
      const requestUrl = urlOverride || url;
      const response = await axios.put(requestUrl, data, config);
      return response.data;
    } catch (err) {
      console.error("Error during putData", err);
      const errorMessage =
        err.response?.data?.errors?.[0]?.errorMessage || // Lấy lỗi từ BE
        "An unknown error occurred."; // Lỗi mặc định nếu không có response từ BE
      setError(errorMessage); // Lưu lỗi vào state
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putData, loading, error }; // Trả về error để sử dụng
};

export default usePut;
