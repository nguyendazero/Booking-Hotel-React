import { useState } from "react";
import axios from "axios";

const usePost = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(url, data);
      return response.data; // Trả về response.data
    } catch (err) {
      setError(err);
      console.error("Error during postData", err);
      return null; // Trả về null khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

export default usePost;
