import { useState } from "react";
import axios from "axios";

const usePost = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, data);
      return response.data;
    } catch (err) {
      console.error("Error during postData", err);
      const errorMessage =
        err.response?.data?.errors?.[0]?.errorMessage ||
        "An unknown error occurred.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

export default usePost;